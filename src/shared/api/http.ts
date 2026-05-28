import { env } from "../config/env";
import type {
  ApiErrorBody,
  CreateRoomResponse,
  GameSettings,
  GenerationOptions,
  JoinRoomResponse,
  PublicRoomState
} from "../model/types";
import { toBackendSettings } from "../model/settings";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const error = body as ApiErrorBody;
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  return body as T;
}

export const api = {
  createRoom(nickname: string, settings?: GameSettings) {
    return request<CreateRoomResponse>("/rooms", {
      method: "POST",
      body: JSON.stringify({ nickname, settings: settings ? toBackendSettings(settings) : undefined })
    });
  },

  joinRoom(roomCode: string, nickname: string) {
    return request<JoinRoomResponse>(`/rooms/${roomCode.toUpperCase()}/join`, {
      method: "POST",
      body: JSON.stringify({ nickname })
    });
  },

  getRoom(roomCode: string) {
    return request<PublicRoomState>(`/rooms/${roomCode.toUpperCase()}`);
  },

  startRoom(roomCode: string, playerId: string, settings: GameSettings) {
    return request<PublicRoomState>(`/rooms/${roomCode.toUpperCase()}/start`, {
      method: "POST",
      body: JSON.stringify({ playerId, settings: toBackendSettings(settings) })
    });
  },

  getGenerationOptions() {
    return request<GenerationOptions>("/tracks/generation-options");
  }
};
