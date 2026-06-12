import { getPlatformScope } from '@/lib/scope';
import { resolveVertical } from '@/domain/vertical/VerticalRegistry';
import { getStoredIndustryKey } from '@/lib/tenant-runtime-config';

export type LabelKey = 'order' | 'customer' | 'technician' | 'asset' | 'branch';

function pluralize(label: string): string {
  const normalized = label.trim();

  if (!normalized) return normalized;

  if (normalized.endsWith('z')) {
    return `${normalized.slice(0, -1)}ces`;
  }

  if (/[aeiouáéíóú]$/i.test(normalized)) {
    return `${normalized}s`;
  }

  return `${normalized}es`;
}

export function getLabel(key: LabelKey, options?: { plural?: boolean }): string {
  const scope = getPlatformScope();
  const vertical = resolveVertical(getStoredIndustryKey() ?? scope?.verticalCode ?? null);
  const label = vertical.labels[key];

  return options?.plural ? pluralize(label) : label;
}

export function getOrderLabel(options?: { plural?: boolean }) {
  return getLabel('order', options);
}

export function getCustomerLabel(options?: { plural?: boolean }) {
  return getLabel('customer', options);
}

export function getTechnicianLabel(options?: { plural?: boolean }) {
  return getLabel('technician', options);
}

export function getAssetLabel(options?: { plural?: boolean }) {
  return getLabel('asset', options);
}
