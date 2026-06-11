import { apiGateway } from '../apiGateway';

export const tenantSettingsService = {
  getTenantLandingSettings: (...args: Parameters<typeof apiGateway.getTenantLandingSettings>) =>
    apiGateway.getTenantLandingSettings(...args),

  updateTenantLandingSettings: (...args: Parameters<typeof apiGateway.updateTenantLandingSettings>) =>
    apiGateway.updateTenantLandingSettings(...args),

  getTenantSettings: (...args: Parameters<typeof apiGateway.getTenantSettings>) =>
    apiGateway.getTenantSettings(...args),

  updateTenantSettings: (...args: Parameters<typeof apiGateway.updateTenantSettings>) =>
    apiGateway.updateTenantSettings(...args),
};
