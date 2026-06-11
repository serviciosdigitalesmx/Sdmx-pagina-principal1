import { apiGateway } from '../apiGateway';

export const inventoryService = {
  getInventory: (...args: Parameters<typeof apiGateway.getInventory>) =>
    apiGateway.getInventory(...args),

  createInventoryItem: (...args: Parameters<typeof apiGateway.createInventoryItem>) =>
    apiGateway.createInventoryItem(...args),

  updateInventoryItem: (...args: Parameters<typeof apiGateway.updateInventoryItem>) =>
    apiGateway.updateInventoryItem(...args),

  getInventoryMovements: (...args: Parameters<typeof apiGateway.getInventoryMovements>) =>
    apiGateway.getInventoryMovements(...args),

  getStockAlerts: (...args: Parameters<typeof apiGateway.getStockAlerts>) =>
    apiGateway.getStockAlerts(...args),

  acknowledgeStockAlert: (...args: Parameters<typeof apiGateway.acknowledgeStockAlert>) =>
    apiGateway.acknowledgeStockAlert(...args),
};
