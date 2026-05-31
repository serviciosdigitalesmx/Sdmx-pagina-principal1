import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { getSecuritySummary, listAuditLogs, listActiveSessions, revokeSession, rotateKeys, setupAdminMfa, updateAdminMfaRequirement, verifyAdminMfa } from '../controllers/security';
import { inviteUser } from '../controllers/users';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/summary', requireTenantModule('security'), getSecuritySummary);
router.get('/audit', requireTenantModule('security'), requireRole('owner'), listAuditLogs);
router.get('/sessions', requireTenantModule('security'), requireRole('owner'), listActiveSessions);
router.delete('/sessions/:id', requireTenantModule('security'), requireRole('owner'), revokeSession);
router.post('/rotate-keys', requireTenantModule('security'), requireRole('owner'), rotateKeys);
router.get('/mfa/setup', requireTenantModule('security'), requireRole('owner', 'manager'), setupAdminMfa);
router.post('/mfa/verify', requireTenantModule('security'), requireRole('owner', 'manager'), verifyAdminMfa);
router.patch('/mfa/require-admins', requireTenantModule('security'), requireRole('owner'), updateAdminMfaRequirement);
router.post('/users/invite', requireTenantModule('security'), requireRole('owner', 'manager'), inviteUser);

export default router;
