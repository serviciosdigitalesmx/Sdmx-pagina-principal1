import { Router } from 'express';
import { 
  crearEquipo, 
  listarEquipos, 
  obtenerEquipo, 
  obtenerEquipoPorFolio,
  actualizarEquipo, 
  agregarFotoSeguimiento, 
  obtenerHistorial 
} from '../controllers/equipos.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Ruta pública (sin autenticación) para consulta de clientes
router.get('/folio/:folio', obtenerEquipoPorFolio);

// Rutas protegidas
router.use(authMiddleware);
router.post('/', crearEquipo);
router.get('/', listarEquipos);
router.get('/:id', obtenerEquipo);
router.put('/:id', actualizarEquipo);
router.post('/foto', agregarFotoSeguimiento);
router.get('/:id/historial', obtenerHistorial);

export default router;
