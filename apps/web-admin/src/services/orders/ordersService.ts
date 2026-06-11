import { apiGateway } from '../apiGateway';

export const ordersService = {
  getOrders: (...args: Parameters<typeof apiGateway.getOrders>) =>
    apiGateway.getOrders(...args),

  getOrderById: (...args: Parameters<typeof apiGateway.getOrderById>) =>
    apiGateway.getOrderById(...args),

  createOrder: (...args: Parameters<typeof apiGateway.createOrder>) =>
    apiGateway.createOrder(...args),

  uploadOrderAttachment: (...args: Parameters<typeof apiGateway.uploadOrderAttachment>) =>
    apiGateway.uploadOrderAttachment(...args),

  addOrderNote: (...args: Parameters<typeof apiGateway.addOrderNote>) =>
    apiGateway.addOrderNote(...args),

  updateOrderStatus: (...args: Parameters<typeof apiGateway.updateOrderStatus>) =>
    apiGateway.updateOrderStatus(...args),

  updateOrderFinancials: (...args: Parameters<typeof apiGateway.updateOrderFinancials>) =>
    apiGateway.updateOrderFinancials(...args),

  updateOrderDetails: (...args: Parameters<typeof apiGateway.updateOrderDetails>) =>
    apiGateway.updateOrderDetails(...args),

  getOrderChecklist: (...args: Parameters<typeof apiGateway.getOrderChecklist>) =>
    apiGateway.getOrderChecklist(...args),

  updateOrderChecklist: (...args: Parameters<typeof apiGateway.updateOrderChecklist>) =>
    apiGateway.updateOrderChecklist(...args),

  updateOrderWarranty: (...args: Parameters<typeof apiGateway.updateOrderWarranty>) =>
    apiGateway.updateOrderWarranty(...args),
};
