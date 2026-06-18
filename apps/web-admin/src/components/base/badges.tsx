'use client';

import type { ReactNode } from 'react';
import { Badge } from '@white-label/ui';

export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}) {
  return <Badge variant={tone}>{children}</Badge>;
}
