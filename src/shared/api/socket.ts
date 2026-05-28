import { io, type Socket } from "socket.io-client";
import { env } from "../config/env";
import type {
  AnswerSubmitted,
  GamePreparingState,
  GameSettings,
  LeaderboardEntry,
  PublicRoomState,
  PublicRoundState,
  RoundResultState
} from "../model/types";
import { toBackendSettings } from "../model/settings";

type ServerEvents = {
  "room:state": (payload: PublicRoomState) => void;
  "player:joined": (payload: { playerId: string }) => void;
  "player:left": (payload: { playerId: string }) => void;
  "game:started": (payload: PublicRoomState) => void;
  "game:preparing": (payload: GamePreparingState) => void;
  "round:started": (payload: PublicRoundState) => void;
  "answer:submitted": (payload: AnswerSubmitted) => void;
  "round:ended": (payload: RoundResultState) => void;
  "leaderboard:updated": (payload: LeaderboardEntry[]) => void;
  "game:ended": (payload: PublicRoomState) => void;
  error: (payload: unknown) => void;
};

type ClientEvents = {
  "room:join": (payload: { roomCode: string; playerId: string }) => void;
  "room:leave": () => void;
  "game:start": (payload: { roomCode: string; playerId: string; settings?: GameSettings }) => void;
  "round:answer": (payload: {
    roomCode: string;
    playerId: string;
    roundId: string;
    selectedOptionId: string;
    clientAnsweredAt?: string;
  }) => void;
  "round:next": (payload: { roomCode: string; playerId: string }) => void;
  "player:updateName": (payload: { roomCode: string; playerId: string; nickname: string }) => void;
};

export type MusicQuizSocket = Socket<ServerEvents, ClientEvents>;

export function createSocket() {
  return io(env.socketUrl, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true
  }) as MusicQuizSocket;
}

export function emitStart(socket: MusicQuizSocket, roomCode: string, playerId: string, settings: GameSettings) {
  socket.emit("game:start", { roomCode, playerId, settings: toBackendSettings(settings) });
}
