import { AlertTriangle, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { labelFallback, strings } from "../shared/i18n/strings";
import {
  PROVIDER_SOURCE_TYPES,
  QUESTION_MODES,
  ROUND_DURATIONS,
  ROUNDS_COUNTS,
  SOURCE_PROVIDERS
} from "../shared/model/types";
import type { GameSettings, GenerationFilters, GenerationOptions, SourceProvider, SourceType } from "../shared/model/types";
import { getDefaultTypeForProvider, getValueRequirement, PRESET_PROVIDERS } from "../shared/model/settings";

type Props = {
  settings: GameSettings;
  generationOptions?: GenerationOptions;
  editable: boolean;
  onChange: (settings: GameSettings) => void;
};

export function SettingsPanel({ settings, generationOptions, editable, onChange }: Props) {
  const provider: SourceProvider = settings.source.provider ?? "spotify";
  const availableTypes = PROVIDER_SOURCE_TYPES[provider];
  const filters = settings.source.filters ?? {};
  const valueReq = getValueRequirement(settings.source.type);

  const selectedPreset = useMemo(() => {
    if (!generationOptions) return "";
    return generationOptions.presets.find((preset) => JSON.stringify(preset.filters) === JSON.stringify(filters))?.id ?? "";
  }, [filters, generationOptions]);

  function patch(next: Partial<GameSettings>) {
    onChange({ ...settings, ...next });
  }

  function patchSource(next: Partial<GameSettings["source"]>) {
    onChange({ ...settings, source: { ...settings.source, ...next } });
  }

  function patchFilters(next: GenerationFilters) {
    patchSource({ filters: { ...filters, ...next } });
  }

  function handleProviderChange(newProvider: SourceProvider) {
    const defaultType = getDefaultTypeForProvider(newProvider);
    onChange({
      ...settings,
      source: {
        ...settings.source,
        provider: newProvider,
        type: defaultType,
        value: undefined
      }
    });
  }

  function handleSourceTypeChange(type: SourceType) {
    const req = getValueRequirement(type);
    patchSource({ type, value: req === "none" ? undefined : "" });
  }

  return (
    <section className="panel-flat p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase">{strings.settings}</h2>
        <SlidersHorizontal className="text-accent" size={22} />
      </div>

      {!editable ? <p className="mb-4 text-sm text-muted">{strings.hostOnly}</p> : null}

      <div className="space-y-5">
        <SegmentedField
          label="Тип вопросов"
          value={settings.questionMode}
          options={QUESTION_MODES.map((id) => ({ id, label: strings.questionMode[id] }))}
          disabled={!editable}
          onChange={(questionMode) => patch({ questionMode })}
        />
        <SegmentedField
          label="Длина раунда"
          value={String(settings.roundDurationSec)}
          options={ROUND_DURATIONS.map((value) => ({ id: String(value), label: `${value} сек` }))}
          disabled={!editable}
          onChange={(roundDurationSec) => patch({ roundDurationSec: Number(roundDurationSec) as GameSettings["roundDurationSec"] })}
        />
        <SegmentedField
          label="Раундов"
          value={String(settings.roundsCount)}
          options={ROUNDS_COUNTS.map((value) => ({ id: String(value), label: String(value) }))}
          disabled={!editable}
          onChange={(roundsCount) => patch({ roundsCount: Number(roundsCount) as GameSettings["roundsCount"] })}
        />

        <SegmentedField
          label="Провайдер"
          value={provider}
          options={SOURCE_PROVIDERS.map((id) => ({ id, label: strings.provider[id] }))}
          disabled={!editable}
          onChange={(p) => handleProviderChange(p as SourceProvider)}
        />

        {provider === "lastfm" ? (
          <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{strings.providerWarning.lastfm}</span>
          </div>
        ) : null}

        <SelectField
          label="Источник"
          value={settings.source.type}
          options={availableTypes.map((id) => ({ id, label: strings.sourceType[id] }))}
          disabled={!editable}
          onChange={(type) => handleSourceTypeChange(type as SourceType)}
        />

        {valueReq !== "none" ? (
          <TextField
            label={strings.sourceValue[settings.source.type] || "Значение"}
            placeholder={strings.sourcePlaceholder[settings.source.type] || ""}
            value={settings.source.value ?? ""}
            type={settings.source.type === "deezer_chart" ? "number" : "text"}
            disabled={!editable}
            required={valueReq === "required"}
            onChange={(value) => patchSource({ value })}
          />
        ) : null}

        {generationOptions ? (
          <div className="rounded-2xl border-2 border-line bg-paper p-4">
            <div className="label mb-3">Музыкальные фильтры</div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label={strings.filters.preset}
                value={selectedPreset}
                options={[{ id: "", label: "Без пресета" }, ...generationOptions.presets.map((preset) => ({ id: preset.id, label: preset.label }))]}
                disabled={!editable}
                onChange={(presetId) => {
                  const preset = generationOptions.presets.find((candidate) => candidate.id === presetId);
                  if (preset) {
                    const presetProvider = preset.provider ?? PRESET_PROVIDERS[preset.id];
                    const nextProvider = presetProvider ?? provider;
                    const defaultType = getDefaultTypeForProvider(nextProvider);
                    onChange({
                      ...settings,
                      source: {
                        ...settings.source,
                        provider: nextProvider,
                        type: defaultType,
                        value: undefined,
                        filters: preset.filters
                      }
                    });
                  }
                }}
              />
              <SelectField
                label={strings.filters.language}
                value={filters.language ?? ""}
                options={toOptions(generationOptions.languages)}
                disabled={!editable}
                onChange={(language) => patchFilters({ language })}
              />
              <SelectField
                label={strings.filters.region}
                value={filters.region ?? ""}
                options={toOptions(generationOptions.regions)}
                disabled={!editable}
                onChange={(region) => patchFilters({ region })}
              />
              <SelectField
                label={strings.filters.popularity}
                value={filters.popularity ?? ""}
                options={toOptions(generationOptions.popularity)}
                disabled={!editable}
                onChange={(popularity) => patchFilters({ popularity })}
              />
              <SelectField
                label={strings.filters.difficulty}
                value={filters.difficulty ?? ""}
                options={toOptions(generationOptions.difficulty)}
                disabled={!editable}
                onChange={(difficulty) => patchFilters({ difficulty })}
              />
              <SelectField
                label={strings.filters.explicitness}
                value={filters.explicitness ?? ""}
                options={toOptions(generationOptions.explicitness)}
                disabled={!editable}
                onChange={(explicitness) => patchFilters({ explicitness })}
              />
            </div>
            <MultiSelectField
              label={strings.filters.decades}
              values={filters.decades ?? []}
              options={generationOptions.decades.map((option) => ({ id: option.id, label: option.label }))}
              disabled={!editable}
              onChange={(decades) => patchFilters({ decades })}
            />
            <MultiSelectField
              label={strings.filters.genres}
              values={filters.genres ?? []}
              options={generationOptions.genres.map((option) => ({ id: option.id, label: option.label }))}
              disabled={!editable}
              onChange={(genres) => patchFilters({ genres })}
            />
            <MultiSelectField
              label={strings.filters.moods}
              values={filters.moods ?? []}
              options={generationOptions.moods.map((option) => ({ id: option.id, label: option.label }))}
              disabled={!editable}
              onChange={(moods) => patchFilters({ moods })}
            />
          </div>
        ) : (
          <div className="label">Фильтры загружаются</div>
        )}
      </div>
    </section>
  );
}

function toOptions(options: { id: string; label: string }[]) {
  return [{ id: "", label: "Не выбрано" }, ...options.map((option) => ({ id: option.id, label: option.label }))];
}

function SegmentedField<T extends string>({
  label,
  value,
  options,
  disabled,
  onChange
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  disabled?: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <div className="label mb-2">{label}</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={`rounded-2xl border-2 border-line px-3 py-3 text-sm font-bold ${
              value === option.id ? "bg-accent text-cream" : "bg-cream"
            } disabled:opacity-70`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <select className="field py-3 text-base" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label || labelFallback(option.id)}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  placeholder,
  type = "text",
  disabled,
  required,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "number";
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <input
        className="field py-3 text-base"
        value={value}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function MultiSelectField({
  label,
  values,
  options,
  disabled,
  onChange
}: {
  label: string;
  values: string[];
  options: { id: string; label: string }[];
  disabled?: boolean;
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="mt-4">
      <div className="label mb-2">{label}</div>
      <div className="flex max-h-44 flex-wrap gap-2 overflow-auto rounded-2xl border-2 border-line bg-cream p-3">
        {options.map((option) => {
          const selected = values.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(selected ? values.filter((value) => value !== option.id) : [...values, option.id])}
              className={`rounded-full border-2 border-line px-3 py-2 text-sm font-semibold ${
                selected ? "bg-ink text-cream" : "bg-paper"
              } disabled:opacity-70`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
