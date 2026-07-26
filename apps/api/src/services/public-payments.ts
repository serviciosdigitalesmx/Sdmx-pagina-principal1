import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function createMercadoPagoPreference(order: any, amount: number) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
  }

  const client = new MercadoPagoConfig({ accessToken: token });
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: order.folio,
          title: `Servicio Fixi - Orden ${order.folio}`,
          quantity: 1,
          unit_price: amount,
          currency_id: 'MXN'
        }
      ],
      external_reference: order.id,
      metadata: {
        tenant_id: order.tenant_id,
        order_id: order.id,
      },
    }
  });

  return result;
}
