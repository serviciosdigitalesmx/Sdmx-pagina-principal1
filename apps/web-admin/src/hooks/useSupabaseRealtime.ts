'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserSupabaseClient } from '@/lib/supabase-browser';
import { getPlatformScope } from '@/lib/scope';

export function useSupabaseRealtime() {
  const queryClient = useQueryClient();
  const scope = getPlatformScope();

  useEffect(() => {
    if (!scope?.tenantId) return;

    const supabase = getBrowserSupabaseClient();
    
    // Suscripción al canal de órdenes
    const channel = supabase.channel('tenant-orders')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'service_orders',
          filter: `tenant_id=eq.${scope.tenantId}`
        },
        () => {
          // Magia: Invalidamos el caché. React Query hará un fetch silencioso 
          // en background y actualizará la UI sin parpadeos.
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, scope?.tenantId]);
}
