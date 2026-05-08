import { Response } from 'express';
import { serviceOrdersService } from '../services/service-orders.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const crearEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const orden = await serviceOrdersService.create(req.token!, req.body);
    res.status(201).json(orden);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listarEquipos = async (req: AuthRequest, res: Response) => {
  try {
    const equipos = await serviceOrdersService.findAll(req.token!);
    res.json(equipos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const equipo = await serviceOrdersService.findById(req.token!, req.params.id);
    res.json(equipo);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const actualizarEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const equipo = await serviceOrdersService.update(req.token!, req.params.id, req.body);
    res.json(equipo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const agregarFotoSeguimiento = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'No implementado aún' });
};

export const obtenerHistorial = async (req: AuthRequest, res: Response) => {
  try {
    const historial = await serviceOrdersService.getHistory(req.token!, req.params.id);
    res.json(historial);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
