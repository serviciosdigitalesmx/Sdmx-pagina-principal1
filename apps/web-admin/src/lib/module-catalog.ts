export type ModuleDeliveryStatus = "ready" | "partial" | "pending";

export type ModuleKey =
  | "summary"
  | "orders"
  | "requests"
  | "landing"
  | "customers"
  | "suppliers"
  | "stock"
  | "tasks"
  | "purchase-orders"
  | "expenses"
  | "finance"
  | "reports"
  | "users"
  | "security"
  | "sucursales"
  | "archivo";

export type ModuleDefinition = {
  key: ModuleKey;
  label: string;
  route: string;
  deliveryStatus: ModuleDeliveryStatus;
  backendContract: "real" | "partial" | "pending";
  notes: string;
};

export const MODULE_CATALOG: ModuleDefinition[] = [
  {
    key: "summary",
    label: "Resumen",
    route: "/dashboard",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Mesa operativa conectada a órdenes reales y KPIs del tenant.",
  },
  {
    key: "orders",
    label: "Órdenes",
    route: "/dashboard/ordenes",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Entrada principal del taller con flujo operativo real.",
  },
  {
    key: "requests",
    label: "Solicitudes",
    route: "/dashboard/solicitudes",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Buzón público y conversión a órdenes.",
  },
  {
    key: "landing",
    label: "Sitio del tenant",
    route: "/dashboard/landing",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Editor de landing comercial por tenant.",
  },
  {
    key: "customers",
    label: "Clientes",
    route: "/dashboard/clientes",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "CRM ligero por tenant con captura y búsqueda.",
  },
  {
    key: "suppliers",
    label: "Proveedores",
    route: "/dashboard/proveedores",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "CRUD real, filtros, estatus e historial de compras por proveedor.",
  },
  {
    key: "stock",
    label: "Stock",
    route: "/dashboard/stock",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Inventario, movimientos y alertas reales.",
  },
  {
    key: "tasks",
    label: "Tareas",
    route: "/dashboard/tareas",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Seguimiento operativo vinculado al trabajo diario.",
  },
  {
    key: "purchase-orders",
    label: "Compras",
    route: "/dashboard/compras",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Órdenes de compra con recepción e impacto en inventario.",
  },
  {
    key: "expenses",
    label: "Gastos",
    route: "/dashboard/gastos",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Flujo real de egresos con tenant scope.",
  },
  {
    key: "finance",
    label: "Finanzas",
    route: "/dashboard/finanzas",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Balance y cashflow con datos reales.",
  },
  {
    key: "reports",
    label: "Reportes",
    route: "/dashboard/reportes",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "KPIs agregados desde órdenes, clientes e inventario.",
  },
  {
    key: "users",
    label: "Usuarios",
    route: "/dashboard/usuarios",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Invitaciones, roles, estado y último acceso con endpoints reales.",
  },
  {
    key: "security",
    label: "Seguridad",
    route: "/dashboard/seguridad",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Auditoría, sesiones activas, MFA y rotación de secretos.",
  },
  {
    key: "sucursales",
    label: "Sucursales",
    route: "/dashboard/sucursales",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Gestión real por tenant y sucursal activa.",
  },
  {
    key: "archivo",
    label: "Archivo",
    route: "/dashboard/archivo",
    deliveryStatus: "ready",
    backendContract: "real",
    notes: "Vista histórica derivada de órdenes reales.",
  },
];

const MODULE_BY_ROUTE = new Map(MODULE_CATALOG.map((module) => [module.route, module]));

export function getModuleByRoute(route: string) {
  return MODULE_BY_ROUTE.get(route) ?? null;
}

export function getModuleByKey(key: ModuleKey) {
  return MODULE_CATALOG.find((module) => module.key === key) ?? null;
}

export function getModuleStatusCounts() {
  return MODULE_CATALOG.reduce(
    (accumulator, module) => {
      accumulator[module.deliveryStatus] += 1;
      return accumulator;
    },
    { ready: 0, partial: 0, pending: 0 },
  );
}
