'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import type { Task } from '@/types';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onTaskSaved: () => void;
}

export function TaskModal({ open, onOpenChange, task, onTaskSaved }: TaskModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
            {task ? 'Editar tarea' : 'Nueva tarea'}
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          key={`${task?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
          task={task}
          onOpenChange={onOpenChange}
          onTaskSaved={onTaskSaved}
        />
      </DialogContent>
    </Dialog>
  );
}

interface TaskFormProps {
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onTaskSaved: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: string;
  assignedUserId: string;
}

function TaskForm({ task, onOpenChange, onTaskSaved }: TaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'pendiente',
    priority: task?.priority ?? 'media',
    dueDate: task?.due_date?.split('T')[0] ?? '',
    assignedUserId: task?.assigned_user_id ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        assignedUserId: formData.assignedUserId || null,
      };

      if (task) {
        await apiClient.put(`/tasks/${task.id}`, payload, getApiOptions());
      } else {
        await apiClient.post('/tasks', payload, getApiOptions());
      }
      onTaskSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Error al guardar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título de la tarea"
              required
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Descripción detallada..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Estado</Label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'pendiente' || value === 'en_proceso' || value === 'bloqueada' || value === 'hecha') {
                    setFormData({ ...formData, status: value });
                  }
                }}
                className="input w-full"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="bloqueada">Bloqueada</option>
                <option value="hecha">Hecha</option>
              </select>
            </div>
            <div>
              <Label>Prioridad</Label>
              <select
                value={formData.priority}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'baja' || value === 'media' || value === 'alta') {
                    setFormData({ ...formData, priority: value });
                  }
                }}
                className="input w-full"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha límite</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Asignado a (ID)</Label>
              <Input
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                placeholder="ID del usuario"
              />
            </div>
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
  );
}
