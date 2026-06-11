import { apiGateway } from '../apiGateway';

export const securityService = {
  getSecuritySummary: (...args: Parameters<typeof apiGateway.getSecuritySummary>) =>
    apiGateway.getSecuritySummary(...args),

  getAuditLogs: (...args: Parameters<typeof apiGateway.getAuditLogs>) =>
    apiGateway.getAuditLogs(...args),

  getSecuritySessions: (...args: Parameters<typeof apiGateway.getSecuritySessions>) =>
    apiGateway.getSecuritySessions(...args),

  revokeSecuritySession: (...args: Parameters<typeof apiGateway.revokeSecuritySession>) =>
    apiGateway.revokeSecuritySession(...args),

  rotateSecurityKeys: (...args: Parameters<typeof apiGateway.rotateSecurityKeys>) =>
    apiGateway.rotateSecurityKeys(...args),

  getMfaSetup: (...args: Parameters<typeof apiGateway.getMfaSetup>) =>
    apiGateway.getMfaSetup(...args),

  verifyMfaCode: (...args: Parameters<typeof apiGateway.verifyMfaCode>) =>
    apiGateway.verifyMfaCode(...args),

  setAdminMfaRequirement: (...args: Parameters<typeof apiGateway.setAdminMfaRequirement>) =>
    apiGateway.setAdminMfaRequirement(...args),
};
