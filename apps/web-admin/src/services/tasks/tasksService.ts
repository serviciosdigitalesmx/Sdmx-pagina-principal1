import { apiGateway } from '../apiGateway';

export const tasksService = {
  getTasks: (...args: Parameters<typeof apiGateway.getTasks>) =>
    apiGateway.getTasks(...args),

  getTaskById: (...args: Parameters<typeof apiGateway.getTaskById>) =>
    apiGateway.getTaskById(...args),

  createTask: (...args: Parameters<typeof apiGateway.createTask>) =>
    apiGateway.createTask(...args),

  updateTask: (...args: Parameters<typeof apiGateway.updateTask>) =>
    apiGateway.updateTask(...args),

  updateTaskStatus: (...args: Parameters<typeof apiGateway.updateTaskStatus>) =>
    apiGateway.updateTaskStatus(...args),

  getTaskHistory: (...args: Parameters<typeof apiGateway.getTaskHistory>) =>
    apiGateway.getTaskHistory(...args),

  deleteTask: (...args: Parameters<typeof apiGateway.deleteTask>) =>
    apiGateway.deleteTask(...args),
};
