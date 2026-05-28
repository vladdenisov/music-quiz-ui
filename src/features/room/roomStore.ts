import { create } from "zustand";
import { api } from "../../shared/api/http";
import { createSocket, emitStart, type MusicQuizSocket } from "../../shared/api/socket";
import { clearSession, readSession, saveSession } from "../../shared/lib/session";
import { mergeSettings } from "../../shared/model/settings";
import type {
  AnswerSubmitted,
  GamePreparingState,
  GameSettings,
  GenerationOptions,
  LeaderboardEntry,
  PublicRoomState,
  PublicRoundState,
  RoundResultState,
  Session
} from "../../shared/model/types";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "reconnecting";

type RoomStore = {
  session?: Session;
  room?: PublicRoomState;
  activeRound?: PublicRoundState;
  roundResult?: RoundResultState;
  leaderboard: LeaderboardEntry[];
  roundOutcomes: Record<number, "correct" | "wrong">;
  generationOptions?: GenerationOptions;
  preparing?: GamePreparingState;
  selectedOptionId?: string;
  answer?: AnswerSubmitted;
  connectionState: ConnectionState;
  error?: string;
  socket?: MusicQuizSocket;

  loadGenerationOptions: () => Promise<void>;
  createRoom: (nickname: string, settings: GameSettings) => Promise<string>;
  joinRoom: (roomCode: string, nickname: string) => Promise<string>;
  loadRoom: (roomCode: string) => Promise<void>;
  restoreSession: (roomCode: string) => Session | undefined;
  connect: (session: Session) => void;
  disconnect: () => void;
  startGame: (settings: GameSettings) => void;
  submitAnswer: (optionId: string) => void;
  nextRound: () => void;
  updateLocalSettings: (settings: GameSettings) => void;
  clearError: () => void;
};

type StoreSet = (partial: Partial<RoomStore> | ((state: RoomStore) => Partial<RoomStore>)) => void;

export const useRoomStore = create<RoomStore>((set, get) => ({
  leaderboard: [],
  roundOutcomes: {},
  connectionState: "idle",

  async loadGenerationOptions() {
    if (get().generationOptions) return;
    const generationOptions = await api.getGenerationOptions();
    set({ generationOptions });
  },

  async createRoom(nickname, settings) {
    const response = await api.createRoom(nickname, settings);
    const session = {
      roomCode: response.roomCode,
      playerId: response.playerId,
      nickname,
      isHost: true
    };
    saveSession(session);
    setFromRoomState(response.state, set);
    set({ session, error: undefined });
    return response.roomCode;
  },

  async joinRoom(roomCode, nickname) {
    const response = await api.joinRoom(roomCode, nickname);
    const session = {
      roomCode: response.roomCode,
      playerId: response.playerId,
      nickname,
      isHost: response.isHost
    };
    saveSession(session);
    setFromRoomState(response.state, set);
    set({ session, error: undefined });
    return response.roomCode;
  },

  async loadRoom(roomCode) {
    const room = await api.getRoom(roomCode);
    setFromRoomState(room, set);
  },

  restoreSession(roomCode) {
    const session = readSession(roomCode);
    set({ session });
    return session;
  },

  connect(session) {
    const current = get().socket;
    current?.disconnect();

    const socket = createSocket();
    bindSocket(socket, set, get);
    set({ socket, connectionState: "connecting", session });
    socket.connect();
    socket.on("connect", () => {
      set({ connectionState: "connected", error: undefined });
      socket.emit("room:join", { roomCode: session.roomCode, playerId: session.playerId });
    });
  },

  disconnect() {
    const socket = get().socket;
    socket?.emit("room:leave");
    socket?.disconnect();
    set({ socket: undefined, connectionState: "disconnected" });
  },

  startGame(settings) {
    const { socket, session } = get();
    if (!socket || !session) return;
    set({ preparing: buildLocalPreparing(session.roomCode, settings), roundOutcomes: {}, roundResult: undefined, selectedOptionId: undefined, answer: undefined });
    emitStart(socket, session.roomCode, session.playerId, settings);
  },

  submitAnswer(optionId) {
    const { socket, session, activeRound, answer, selectedOptionId } = get();
    if (!socket || !session || !activeRound || answer || selectedOptionId) return;
    set({ selectedOptionId: optionId });
    socket.emit("round:answer", {
      roomCode: session.roomCode,
      playerId: session.playerId,
      roundId: activeRound.roundId,
      selectedOptionId: optionId,
      clientAnsweredAt: new Date().toISOString()
    });
  },

  nextRound() {
    const { socket, session } = get();
    if (!socket || !session) return;
    socket.emit("round:next", { roomCode: session.roomCode, playerId: session.playerId });
  },

  updateLocalSettings(settings) {
    const room = get().room;
    if (!room) return;
    set({ room: { ...room, settings } });
  },

  clearError() {
    set({ error: undefined });
  }
}));

function bindSocket(socket: MusicQuizSocket, set: StoreSet, get: () => RoomStore) {
  socket.on("disconnect", () => set({ connectionState: "disconnected" }));
  socket.io.on("reconnect_attempt", () => set({ connectionState: "reconnecting" }));
  socket.on("room:state", (state) => setFromRoomState(state, set));
  socket.on("game:started", (state) => {
    set({ preparing: undefined, roundOutcomes: {}, roundResult: undefined, selectedOptionId: undefined, answer: undefined });
    setFromRoomState(state, set);
  });
  socket.on("game:preparing", (preparing) => set({ preparing }));
  socket.on("round:started", (round) => {
    set({ preparing: undefined, activeRound: round, roundResult: undefined, selectedOptionId: undefined, answer: undefined });
  });
  socket.on("answer:submitted", (answer) => set({ answer, selectedOptionId: answer.selectedOptionId }));
  socket.on("round:ended", (roundResult) => {
    const state = get();
    const roundNumber = state.activeRound?.roundNumber;
    const playerResult = roundResult.playerResults.find((result) => result.playerId === state.session?.playerId);
    set({
      roundResult,
      roundOutcomes:
        roundNumber && playerResult
          ? {
              ...state.roundOutcomes,
              [roundNumber]: playerResult.isCorrect ? "correct" : "wrong"
            }
          : state.roundOutcomes
    });
  });
  socket.on("leaderboard:updated", (leaderboard) => set({ leaderboard }));
  socket.on("game:ended", (state) => setFromRoomState(state, set));
  socket.on("error", (payload) => {
    const message = extractSocketError(payload);
    if (message.includes("Room not found") || message.includes("Player is not in this room")) {
      clearSession();
      get().socket?.disconnect();
      set({ session: undefined, connectionState: "disconnected" });
    }
    set({ error: message });
  });
}

function buildLocalPreparing(roomCode: string, settings: GameSettings): GamePreparingState {
  return {
    roomCode,
    phase: "queued",
    message: "Готовим игру",
    requestedRounds: settings.roundsCount,
    targetTracks: Math.max(settings.roundsCount + 12, settings.roundsCount * 4)
  };
}

function setFromRoomState(room: PublicRoomState, set: StoreSet) {
  set((state) => ({
    room: {
      ...room,
      settings: mergeSettings(room.settings)
    },
    activeRound: room.currentRound ?? (state.roundResult ? state.activeRound : undefined),
    leaderboard: room.players
      .map((player) => ({ playerId: player.id, nickname: player.nickname, score: player.score }))
      .sort((left, right) => right.score - left.score)
  }));
}

function extractSocketError(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: { message?: string } }).error;
    const message = error?.message || "Socket error";
    if (message.includes("LASTFM_API_KEY")) {
      return "Last.fm не настроен на сервере";
    }
    return message;
  }
  return "Socket error";
}
