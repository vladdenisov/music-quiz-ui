export const ROUND_DURATIONS = [5, 10, 15] as const;
export const ROUNDS_COUNTS = [5, 10, 15] as const;
export const QUESTION_MODES = ["guess_song", "guess_artist", "mixed"] as const;
export const SOURCE_PROVIDERS = ["spotify", "deezer", "lastfm"] as const;
export const SOURCE_TYPES = [
  "random", "spotify_playlist", "artist", "genre",
  "deezer_playlist", "deezer_chart",
  "lastfm_tag", "lastfm_geo", "lastfm_chart"
] as const;

export type RoundDurationSec = (typeof ROUND_DURATIONS)[number];
export type RoundsCount = (typeof ROUNDS_COUNTS)[number];
export type QuestionMode = (typeof QUESTION_MODES)[number];
export type QuestionType = Exclude<QuestionMode, "mixed">;
export type SourceProvider = (typeof SOURCE_PROVIDERS)[number];
export type SourceType = (typeof SOURCE_TYPES)[number];
export type RoomStatus = "lobby" | "in_game" | "ended";

export const PROVIDER_SOURCE_TYPES: Record<SourceProvider, SourceType[]> = {
  spotify: ["random", "spotify_playlist", "artist", "genre"],
  deezer: ["random", "deezer_playlist", "deezer_chart", "artist"],
  lastfm: ["random", "lastfm_tag", "lastfm_geo", "lastfm_chart"]
};

export const PROVIDER_DEFAULT_TYPE: Record<SourceProvider, SourceType> = {
  spotify: "random",
  deezer: "deezer_chart",
  lastfm: "lastfm_chart"
};

export type GenerationOption<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
  spotifyQuery?: string;
};

export type GenerationFilters = {
  language?: string;
  decades?: string[];
  genres?: string[];
  moods?: string[];
  region?: string;
  popularity?: string;
  difficulty?: string;
  explicitness?: string;
};

export type GenerationPreset = GenerationOption & {
  filters: GenerationFilters;
  provider?: SourceProvider;
};

export type GenerationOptions = {
  languages: GenerationOption[];
  decades: GenerationOption[];
  genres: GenerationOption[];
  moods: GenerationOption[];
  regions: GenerationOption[];
  popularity: GenerationOption[];
  difficulty: GenerationOption[];
  explicitness: GenerationOption[];
  presets: GenerationPreset[];
};

export type GameSettings = {
  roundsCount: RoundsCount;
  roundDurationSec: RoundDurationSec;
  questionMode: QuestionMode;
  answerOptionsCount: 4;
  source: {
    provider?: SourceProvider;
    type: SourceType;
    value?: string;
    market?: string;
    filters?: GenerationFilters;
  };
};

export type AnswerOption = {
  id: string;
  label: string;
};

export type PublicRoundState = {
  roundId: string;
  roundNumber: number;
  questionType: QuestionType;
  questionText: string;
  previewUrl: string;
  artworkUrl?: string;
  options: AnswerOption[];
  roundStartedAt: string;
  roundEndsAt: string;
  durationSec: RoundDurationSec;
};

export type RoundResultState = {
  roundId: string;
  correctOptionId: string;
  correctTitle: string;
  correctArtist: string;
  album?: string;
  artworkUrl?: string;
  playerResults: {
    playerId: string;
    selectedOptionId?: string;
    isCorrect: boolean;
    answeredAt?: string;
    score: number;
  }[];
};

export type PublicPlayerState = {
  id: string;
  nickname: string;
  score: number;
  isHost: boolean;
  isConnected: boolean;
};

export type PublicRoomState = {
  id: string;
  code: string;
  status: RoomStatus;
  hostPlayerId: string;
  settings: GameSettings;
  players: PublicPlayerState[];
  currentRound?: PublicRoundState;
};

export type LeaderboardEntry = {
  playerId: string;
  nickname: string;
  score: number;
};

export type GamePreparingState = {
  roomCode: string;
  phase: "queued" | "spotify_search" | "preview_matching" | "building_rounds" | "ready" | "failed";
  message: string;
  requestedRounds: number;
  targetTracks: number;
  foundSourceTracks?: number;
  matchedTracks?: number;
  rejectedTracks?: number;
};

export type CreateRoomResponse = {
  roomCode: string;
  roomId: string;
  playerId: string;
  isHost: boolean;
  state: PublicRoomState;
};

export type JoinRoomResponse = CreateRoomResponse;

export type AnswerSubmitted = {
  accepted: true;
  selectedOptionId: string;
  answeredAt: string;
  score: number;
};

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    issues?: unknown;
  };
};

export type Session = {
  roomCode: string;
  playerId: string;
  nickname: string;
  isHost: boolean;
};
