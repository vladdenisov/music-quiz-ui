import type { GameSettings, GenerationFilters, SourceProvider, SourceType } from "./types";
import { PROVIDER_DEFAULT_TYPE } from "./types";

export const defaultSettings: GameSettings = {
  roundsCount: 10,
  roundDurationSec: 10,
  questionMode: "mixed",
  answerOptionsCount: 4,
  source: {
    provider: "spotify",
    type: "random",
    market: "US",
    filters: {
      language: "mixed",
      popularity: "popular",
      difficulty: "medium",
      explicitness: "clean",
      region: "global"
    }
  }
};

export function mergeSettings(settings?: Partial<GameSettings>): GameSettings {
  return {
    ...defaultSettings,
    ...settings,
    source: {
      ...defaultSettings.source,
      ...settings?.source,
      filters: {
        ...defaultSettings.source.filters,
        ...settings?.source?.filters
      }
    }
  };
}

export function sanitizeFilters(filters?: GenerationFilters): GenerationFilters | undefined {
  if (!filters) return undefined;

  const next: GenerationFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      next[key as keyof GenerationFilters] = value as never;
    } else if (typeof value === "string" && value.trim()) {
      next[key as keyof GenerationFilters] = value.trim() as never;
    }
  }

  return Object.keys(next).length > 0 ? next : undefined;
}

export function toBackendSettings(settings: GameSettings): GameSettings {
  const filters = sanitizeFilters(settings.source.filters);
  const region = filters?.region;
  return {
    ...settings,
    source: {
      ...settings.source,
      provider: settings.source.provider || "spotify",
      value: settings.source.value?.trim() || undefined,
      market: region && region !== "global" ? region : settings.source.market || "US",
      filters
    }
  };
}

export function getDefaultTypeForProvider(provider: SourceProvider): SourceType {
  return PROVIDER_DEFAULT_TYPE[provider];
}

export type SourceValueRequirement = "required" | "optional" | "none";

const VALUE_REQUIREMENT: Record<SourceType, SourceValueRequirement> = {
  random: "none",
  spotify_playlist: "required",
  artist: "required",
  genre: "required",
  deezer_playlist: "required",
  deezer_chart: "optional",
  lastfm_tag: "required",
  lastfm_geo: "required",
  lastfm_chart: "none"
};

export function getValueRequirement(type: SourceType): SourceValueRequirement {
  return VALUE_REQUIREMENT[type];
}

export function validateSource(source: GameSettings["source"]): string | undefined {
  const req = getValueRequirement(source.type);
  if (req === "required" && !source.value?.trim()) {
    return "Заполните поле значения источника";
  }
  if (source.type === "deezer_chart" && source.value?.trim()) {
    const num = Number(source.value.trim());
    if (Number.isNaN(num) || num < 0) {
      return "ID жанра должен быть числом ≥ 0";
    }
  }
  return undefined;
}

export const PRESET_PROVIDERS: Record<string, SourceProvider> = {
  russian_party: "deezer",
  rus_rock_classics: "deezer",
  post_soviet: "deezer",
  english_party: "spotify",
  modern_pop: "spotify"
};
