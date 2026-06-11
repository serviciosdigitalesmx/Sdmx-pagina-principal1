import { apiGateway } from '../apiGateway';

export const requestsService = {
  getServiceRequests: (...args: Parameters<typeof apiGateway.getServiceRequests>) =>
    apiGateway.getServiceRequests(...args),

  getServiceRequestById: (...args: Parameters<typeof apiGateway.getServiceRequestById>) =>
    apiGateway.getServiceRequestById(...args),

  convertServiceRequestToOrder: (...args: Parameters<typeof apiGateway.convertServiceRequestToOrder>) =>
    apiGateway.convertServiceRequestToOrder(...args),
};
