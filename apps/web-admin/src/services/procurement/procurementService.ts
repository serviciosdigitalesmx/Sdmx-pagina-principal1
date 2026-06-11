import { apiGateway } from '../apiGateway';

export const procurementService = {
  getProcurementSummary: () =>
    apiGateway.getProcurementSummary(),

  getSuppliers: (...args: Parameters<typeof apiGateway.getSuppliers>) =>
    apiGateway.getSuppliers(...args),

  getSupplierById: (...args: Parameters<typeof apiGateway.getSupplierById>) =>
    apiGateway.getSupplierById(...args),

  createSupplier: (...args: Parameters<typeof apiGateway.createSupplier>) =>
    apiGateway.createSupplier(...args),

  updateSupplier: (...args: Parameters<typeof apiGateway.updateSupplier>) =>
    apiGateway.updateSupplier(...args),

  updateSupplierStatus: (...args: Parameters<typeof apiGateway.updateSupplierStatus>) =>
    apiGateway.updateSupplierStatus(...args),

  deleteSupplier: (...args: Parameters<typeof apiGateway.deleteSupplier>) =>
    apiGateway.deleteSupplier(...args),

  getPurchaseOrders: (...args: Parameters<typeof apiGateway.getPurchaseOrders>) =>
    apiGateway.getPurchaseOrders(...args),

  getPurchaseOrderById: (...args: Parameters<typeof apiGateway.getPurchaseOrderById>) =>
    apiGateway.getPurchaseOrderById(...args),

  createPurchaseOrder: (...args: Parameters<typeof apiGateway.createPurchaseOrder>) =>
    apiGateway.createPurchaseOrder(...args),

  updatePurchaseOrder: (...args: Parameters<typeof apiGateway.updatePurchaseOrder>) =>
    apiGateway.updatePurchaseOrder(...args),

  updatePurchaseOrderStatus: (...args: Parameters<typeof apiGateway.updatePurchaseOrderStatus>) =>
    apiGateway.updatePurchaseOrderStatus(...args),

  receivePurchaseOrder: (...args: Parameters<typeof apiGateway.receivePurchaseOrder>) =>
    apiGateway.receivePurchaseOrder(...args),

  deletePurchaseOrder: (...args: Parameters<typeof apiGateway.deletePurchaseOrder>) =>
    apiGateway.deletePurchaseOrder(...args),
};
