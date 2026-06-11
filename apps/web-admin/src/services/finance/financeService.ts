import { apiGateway } from '../apiGateway';

export const financeService = {
  getBalance: (...args: Parameters<typeof apiGateway.getBalance>) =>
    apiGateway.getBalance(...args),

  getCashflow: (...args: Parameters<typeof apiGateway.getCashflow>) =>
    apiGateway.getCashflow(...args),

  getExpenses: (...args: Parameters<typeof apiGateway.getExpenses>) =>
    apiGateway.getExpenses(...args),

  getExpense: (...args: Parameters<typeof apiGateway.getExpense>) =>
    apiGateway.getExpense(...args),

  createExpense: (...args: Parameters<typeof apiGateway.createExpense>) =>
    apiGateway.createExpense(...args),

  deleteExpense: (...args: Parameters<typeof apiGateway.deleteExpense>) =>
    apiGateway.deleteExpense(...args),
};
