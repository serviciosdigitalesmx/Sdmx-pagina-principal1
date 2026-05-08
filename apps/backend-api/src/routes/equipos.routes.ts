import { Router } from 'express';
import { 
  crearEquipo, 
  listarEquipos, 
  obtenerEquipo, 
  actualizarEquipo, 
  agregarFotoSeguimiento, 
  obtenerHistorial 
} from '../controllers/equipos.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.post('/', crearEquipo);
router.get('/', listarEquipos);
router.get('/:id', obtenerEquipo);
router.put('/:id', actualizarEquipo);
router.post('/foto', agregarFotoSeguimiento);
router.get('/:id/historial', obtenerHistorial);

export default router;
