import type { ReactNode } from 'react';

export type DynamicFieldType = 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'date' | 'money';

export type DynamicFieldDefinition = {
  id?: string;
  entity: string;
  field_key: string;
  field_label: string;
  field_type: DynamicFieldType;
  required?: boolean;
  options?: Array<string | { label?: string; value?: string | number | boolean }>;
  field_order?: number;
  placeholder?: string | null;
  help_text?: string | null;
  visible?: boolean;
  validation?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

type Props = {
  definitions: DynamicFieldDefinition[];
  values: Record<string, string | boolean>;
  onChange: (fieldKey: string, value: string | boolean) => void;
  title?: string;
  className?: string;
  renderPrefix?: ReactNode;
};

function normalizeOption(option: string | { label?: string; value?: string | number | boolean }) {
  if (typeof option === 'string') {
    return { label: option, value: option };
  }
  const value = option.value ?? option.label ?? '';
  return { label: option.label ?? String(value), value };
}

export function DynamicFields({ definitions, values, onChange, title, className }: Props) {
  if (!definitions.length) {
    return null;
  }

  return (
    <section className={className}>
      {title ? <h3 className="mb-4 text-xl font-semibold text-sky-400">{title}</h3> : null}
      <div className="grid gap-4">
        {definitions.map((definition) => {
          const value = values[definition.field_key];
          const common = {
            id: definition.field_key,
            required: definition.required,
            placeholder: definition.placeholder ?? undefined,
            className: 'w-full rounded-2xl border border-sky-400/30 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500',
          };
          const label = (
            <span className="text-sm text-zinc-300">
              {definition.field_label}
              {definition.required ? ' *' : ''}
            </span>
          );

          return (
            <label key={definition.field_key} className="space-y-2">
              {label}
              {definition.help_text ? <p className="text-xs text-zinc-500">{definition.help_text}</p> : null}
              {definition.field_type === 'textarea' ? (
                <textarea
                  {...common}
                  rows={4}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(definition.field_key, event.target.value)}
                />
              ) : definition.field_type === 'select' ? (
                <select
                  {...common}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => onChange(definition.field_key, event.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {(definition.options ?? []).map((option, index) => {
                    const normalized = normalizeOption(option);
                    return (
                      <option key={`${definition.field_key}-${index}`} value={String(normalized.value)}>
                        {normalized.label}
                      </option>
                    );
                  })}
                </select>
              ) : definition.field_type === 'boolean' ? (
                <label className="flex items-center gap-3 rounded-2xl border border-sky-400/30 bg-zinc-950 px-4 py-3 text-zinc-100">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(definition.field_key, event.target.checked)}
                    className="h-5 w-5 rounded border-zinc-700"
                  />
                  <span>{definition.placeholder || definition.field_label}</span>
                </label>
              ) : (
                <input
                  {...common}
                  type={definition.field_type === 'date' ? 'date' : definition.field_type === 'number' || definition.field_type === 'money' ? 'number' : 'text'}
                  min={definition.field_type === 'money' || definition.field_type === 'number' ? 0 : undefined}
                  step={definition.field_type === 'money' ? '0.01' : undefined}
                  value={typeof value === 'string' ? value : value ? 'true' : ''}
                  onChange={(event) => onChange(definition.field_key, event.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>
    </section>
  );
}
