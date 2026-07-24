'use client';

import { useState, useEffect } from 'react';
import { QuickReceiveModal } from './quick-receive-modal';

export function GlobalQuickReceiveModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-quick-receive', handleOpen);
    return () => window.removeEventListener('open-quick-receive', handleOpen);
  }, []);

  return <QuickReceiveModal open={open} onOpenChange={setOpen} />;
}
