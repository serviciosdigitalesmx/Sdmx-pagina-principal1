import { fixService } from '../fixService';

export const requestsService = {
  getServiceRequests: (...args: Parameters<typeof fixService.getServiceRequests>) =>
    fixService.getServiceRequests(...args),

  getServiceRequestById: (...args: Parameters<typeof fixService.getServiceRequestById>) =>
    fixService.getServiceRequestById(...args),

  convertServiceRequestToOrder: (...args: Parameters<typeof fixService.convertServiceRequestToOrder>) =>
    fixService.convertServiceRequestToOrder(...args),
};
