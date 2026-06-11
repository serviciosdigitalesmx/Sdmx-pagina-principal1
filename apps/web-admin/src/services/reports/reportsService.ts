import { apiGateway } from '../apiGateway';

export const reportsService = {
  getReportsSummary: (...args: Parameters<typeof apiGateway.getReportsSummary>) =>
    apiGateway.getReportsSummary(...args),
};
