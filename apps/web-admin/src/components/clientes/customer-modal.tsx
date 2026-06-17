'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import type { Customer } from '@/types';

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onCustomerSaved: () => void;
}

export function CustomerModal({ open, onOpenChange, customer, onCustomerSaved }: CustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.full_name || customer.name,
        phone: customer.phone,
        email: customer.email || '',
      });
    } else {
      setFormData({ name: '', phone: '', email: '' });
    }
  }, [customer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Nombre y teléfono son requeridos');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (customer) {
        // Update existing customer
        await apiClient.put(`/customers/${customer.id}`, formData, getApiOptions());
      } else {
        // Create new customer
        await apiClient.post('/customers', formData, getApiOptions());
      }
      onCustomerSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save customer:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
            {customer ? 'Editar cliente' : 'Nuevo cliente'}
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            <p className="font-semibold">No se pudo guardar el cliente</p>
            <p className="mt-1 text-rose-100/80">{error}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div>
            <Label>Teléfono *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="5512345678"
              maxLength={10}
              required
            />
            <p className="mt-1 text-xs text-slate-400">10 dígitos, solo números</p>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="cliente@email.com"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
