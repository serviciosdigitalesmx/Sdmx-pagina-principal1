'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { isRouteEnabled } from '@/lib/module-access';

export function ModuleRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const allowed = useMemo(() => isRouteEnabled(pathname), [pathname]);

  useEffect(() => {
    if (!allowed) {
      router.replace('/dashboard');
    }
  }, [allowed, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
