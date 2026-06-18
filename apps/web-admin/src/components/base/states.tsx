'use client';

import type { ReactNode } from 'react';
import { EmptyState as UISEmptyState, LoadingState as UILoadingState } from '@white-label/ui';

export function LoadingState({
  label = 'Cargando...',
}: {
  label?: string;
}) {
  return <UILoadingState title={label} />;
}

export function ErrorState({
  title = 'No se pudo cargar la vista',
  message,
  action,
}: {
  title?: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <UISEmptyState
      title={title}
      description={message}
      action={action}
      className="border-rose-400/20 bg-rose-500/10"
    />
  );
}
