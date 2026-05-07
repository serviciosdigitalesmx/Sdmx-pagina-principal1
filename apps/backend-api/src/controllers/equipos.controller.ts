import { Request, Response } from 'express';
import { serviceOrdersService } from '../services/service-orders.service';
import { AuthRequest } from '../middleware/auth';

export const crearEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const orden = await serviceOrdersService.create(req.user!.tenant_id, req.body);
    res.status(201).json(orden);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listarEquipos = async (req: AuthRequest, res: Response) => {
  try {
    const equipos = await serviceOrdersService.findAll(req.user!.tenant_id, req.query);
    res.json(equipos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const equipo = await serviceOrdersService.findById(req.user!.tenant_id, req.params.id);
    res.json(equipo);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const obtenerEquipoPorFolio = async (req: Request, res: Response) => {
  try {
    // Este endpoint NO requiere autenticación (es público para que el cliente consulte)
    const equipo = await serviceOrdersService.findByFolioForClient(req.params.folio);
    res.json(equipo);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const actualizarEquipo = async (req: AuthRequest, res: Response) => {
  try {
    const equipo = await serviceOrdersService.update(req.user!.tenant_id, req.params.id, req.body);
    res.json(equipo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const agregarFotoSeguimiento = async (req: AuthRequest, res: Response) => {
  try {
    const { equipoId, url } = req.body;
    await serviceOrdersService.addFollowUpPhoto(equipoId, url, req.user!.tenant_id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerHistorial = async (req: AuthRequest, res: Response) => {
  try {
    const historial = await serviceOrdersService.getHistory(req.params.id, req.user!.tenant_id);
    res.json(historial);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
