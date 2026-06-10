import { fixService } from '../fixService';

export const financeService = {
  getBalance: (...args: Parameters<typeof fixService.getBalance>) =>
    fixService.getBalance(...args),

  getCashflow: (...args: Parameters<typeof fixService.getCashflow>) =>
    fixService.getCashflow(...args),

  getExpenses: (...args: Parameters<typeof fixService.getExpenses>) =>
    fixService.getExpenses(...args),

  getExpense: (...args: Parameters<typeof fixService.getExpense>) =>
    fixService.getExpense(...args),

  createExpense: (...args: Parameters<typeof fixService.createExpense>) =>
    fixService.createExpense(...args),

  deleteExpense: (...args: Parameters<typeof fixService.deleteExpense>) =>
    fixService.deleteExpense(...args),
};
