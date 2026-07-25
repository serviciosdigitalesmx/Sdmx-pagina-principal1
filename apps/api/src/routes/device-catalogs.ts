import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import {
  getFamilies, createFamily, updateFamily, deleteFamily,
  getBrands, createBrand, updateBrand, deleteBrand,
  getModels, createModel, updateModel, deleteModel,
  getFaults, createFault, updateFault, deleteFault,
  getParts, createPart, updatePart, deletePart,
  getChecklists
} from '../controllers/device-catalogs';

const router = Router();

router.use(requireAuth);
router.use(requireTenantBillingActive);

// Families
router.get('/families', getFamilies);
router.post('/families', createFamily);
router.put('/families/:id', updateFamily);
router.delete('/families/:id', deleteFamily);

// Brands
router.get('/brands', getBrands);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

// Models
router.get('/models', getModels);
router.post('/models', createModel);
router.put('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);

// Faults
router.get('/faults', getFaults);
router.post('/faults', createFault);
router.put('/faults/:id', updateFault);
router.delete('/faults/:id', deleteFault);

// Parts
router.get('/parts', getParts);
router.post('/parts', createPart);
router.put('/parts/:id', updatePart);
router.delete('/parts/:id', deletePart);

// Checklists
router.get('/checklists', getChecklists);

export default router;
