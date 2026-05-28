import { describe, expect, it } from "vitest";
import { defaultSettings, getDefaultTypeForProvider, sanitizeFilters, toBackendSettings, validateSource } from "./settings";

describe("settings mapping", () => {
  it("keeps backend-required answer options and filter shape", () => {
    const settings = toBackendSettings({
      ...defaultSettings,
      source: {
        provider: "spotify",
        type: "genre",
        value: "pop",
        market: "",
        filters: {
          language: "russian",
          decades: ["1990s", "2000s"],
          genres: [],
          moods: ["party"],
          region: "RU",
          popularity: "mainstream",
          difficulty: "easy",
          explicitness: "clean"
        }
      }
    });

    expect(settings.answerOptionsCount).toBe(4);
    expect(settings.source.market).toBe("RU");
    expect(settings.source.provider).toBe("spotify");
    expect(settings.source.filters).toEqual({
      language: "russian",
      decades: ["1990s", "2000s"],
      moods: ["party"],
      region: "RU",
      popularity: "mainstream",
      difficulty: "easy",
      explicitness: "clean"
    });
  });

  it("drops empty filter values", () => {
    expect(sanitizeFilters({ language: "", genres: [], moods: ["dance"] })).toEqual({ moods: ["dance"] });
  });

  it("does not send global as preview market", () => {
    const settings = toBackendSettings({
      ...defaultSettings,
      source: {
        provider: "spotify",
        type: "random",
        filters: { region: "global" }
      }
    });

    expect(settings.source.market).toBe("US");
    expect(settings.source.filters?.region).toBe("global");
  });

  it("defaults provider to spotify when undefined", () => {
    const settings = toBackendSettings({
      ...defaultSettings,
      source: {
        type: "random",
        filters: {}
      }
    });

    expect(settings.source.provider).toBe("spotify");
  });

  it("preserves deezer provider through toBackendSettings", () => {
    const settings = toBackendSettings({
      ...defaultSettings,
      source: {
        provider: "deezer",
        type: "deezer_chart",
        value: "0",
        filters: { language: "russian" }
      }
    });

    expect(settings.source.provider).toBe("deezer");
    expect(settings.source.type).toBe("deezer_chart");
    expect(settings.source.value).toBe("0");
  });
});

describe("getDefaultTypeForProvider", () => {
  it("returns random for spotify", () => {
    expect(getDefaultTypeForProvider("spotify")).toBe("random");
  });

  it("returns deezer_chart for deezer", () => {
    expect(getDefaultTypeForProvider("deezer")).toBe("deezer_chart");
  });

  it("returns lastfm_chart for lastfm", () => {
    expect(getDefaultTypeForProvider("lastfm")).toBe("lastfm_chart");
  });
});

describe("validateSource", () => {
  it("passes when random type has no value", () => {
    expect(validateSource({ provider: "spotify", type: "random" })).toBeUndefined();
  });

  it("fails when playlist type has empty value", () => {
    expect(validateSource({ provider: "spotify", type: "spotify_playlist", value: "" })).toBeDefined();
    expect(validateSource({ provider: "spotify", type: "spotify_playlist", value: "  " })).toBeDefined();
  });

  it("passes when playlist type has value", () => {
    expect(validateSource({ provider: "spotify", type: "spotify_playlist", value: "abc123" })).toBeUndefined();
  });

  it("allows optional value for deezer_chart", () => {
    expect(validateSource({ provider: "deezer", type: "deezer_chart" })).toBeUndefined();
    expect(validateSource({ provider: "deezer", type: "deezer_chart", value: "" })).toBeUndefined();
    expect(validateSource({ provider: "deezer", type: "deezer_chart", value: "132" })).toBeUndefined();
  });

  it("rejects non-numeric deezer_chart value", () => {
    expect(validateSource({ provider: "deezer", type: "deezer_chart", value: "abc" })).toBeDefined();
  });

  it("requires value for lastfm_tag", () => {
    expect(validateSource({ provider: "lastfm", type: "lastfm_tag", value: "" })).toBeDefined();
    expect(validateSource({ provider: "lastfm", type: "lastfm_tag", value: "rock" })).toBeUndefined();
  });

  it("requires value for lastfm_geo", () => {
    expect(validateSource({ provider: "lastfm", type: "lastfm_geo", value: "" })).toBeDefined();
    expect(validateSource({ provider: "lastfm", type: "lastfm_geo", value: "russia" })).toBeUndefined();
  });

  it("passes for lastfm_chart without value", () => {
    expect(validateSource({ provider: "lastfm", type: "lastfm_chart" })).toBeUndefined();
  });

  it("requires value for deezer_playlist", () => {
    expect(validateSource({ provider: "deezer", type: "deezer_playlist", value: "" })).toBeDefined();
    expect(validateSource({ provider: "deezer", type: "deezer_playlist", value: "123" })).toBeUndefined();
  });

  it("requires value for artist type", () => {
    expect(validateSource({ provider: "deezer", type: "artist", value: "" })).toBeDefined();
    expect(validateSource({ provider: "deezer", type: "artist", value: "12345" })).toBeUndefined();
  });
});
