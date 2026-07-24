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

  getInventoryReservations: (...args: Parameters<typeof apiGateway.getInventoryReservations>) =>
    apiGateway.getInventoryReservations(...args),

  createInventoryReservation: (...args: Parameters<typeof apiGateway.createInventoryReservation>) =>
    apiGateway.createInventoryReservation(...args),

  consumeInventoryReservation: (...args: Parameters<typeof apiGateway.consumeInventoryReservation>) =>
    apiGateway.consumeInventoryReservation(...args),

  releaseInventoryReservation: (...args: Parameters<typeof apiGateway.releaseInventoryReservation>) =>
    apiGateway.releaseInventoryReservation(...args),
};
