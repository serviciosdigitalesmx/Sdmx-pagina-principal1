export interface VerticalConfig {
  code: string;
  name: string;
  labels: {
    branch: string;
    order: string;
    customer: string;
    technician: string;
    asset: string;
  };
}

export const DEFAULT_VERTICAL_CONFIG: VerticalConfig = {
  code: 'repair_shop',
  name: 'Taller de reparación',
  labels: {
    branch: 'Sucursal',
    order: 'Orden',
    customer: 'Cliente',
    technician: 'Técnico',
    asset: 'Equipo',
  },
};
