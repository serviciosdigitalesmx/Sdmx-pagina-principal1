type WhatsAppTemplateInput = {
  eventKey?: string;
  template?: string;
  fallbackTemplate?: string;
  variables?: Record<string, string | number | boolean | null | undefined>;
};

function interpolateTemplate(template: string, variables: Record<string, string | number | boolean | null | undefined>) {
  return template.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_match, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) {
      return "";
    }
    return String(value);
  });
}

export function renderWhatsAppMessage(
  order: {
    folio?: string;
    clientName?: string;
    summary?: string;
    locale?: string;
  },
  options: WhatsAppTemplateInput = {},
) {
  const locale = order.locale ?? "es";
  const labels = {
    es: {
      greeting: "Hola",
      order: "orden",
      details: "Detalles",
      closing: "Gracias",
    },
    en: {
      greeting: "Hello",
      order: "order",
      details: "Details",
      closing: "Thanks",
    },
  }[locale === "en" ? "en" : "es"];

  const fallbackMessage = [
    `${labels.greeting} ${order.clientName ?? ""},`,
    "",
    `Le compartimos su ${labels.order} ${order.folio ?? ""}.`,
    `${labels.details}: ${order.summary ?? ""}`,
    "",
    labels.closing + ".",
  ].join("\n");

  const selectedTemplate = options.template ?? options.fallbackTemplate;
  if (!selectedTemplate) {
    return fallbackMessage;
  }

  const mergedVariables = {
    client_name: order.clientName ?? "",
    customer_name: order.clientName ?? "",
    order_folio: order.folio ?? "",
    order_status: options.variables?.order_status ?? "",
    portal_url: options.variables?.portal_url ?? "",
    estimated_date: options.variables?.estimated_date ?? "",
    amount_due: options.variables?.amount_due ?? "",
    tenant_phone: options.variables?.tenant_phone ?? "",
    business_name: options.variables?.business_name ?? "",
    summary: order.summary ?? "",
    ...options.variables,
  };

  const templateToUse = options.template ?? options.fallbackTemplate ?? fallbackMessage;
  return interpolateTemplate(templateToUse, mergedVariables);
}

export function useWhatsAppTemplate(
  order: {
    folio?: string;
    clientName?: string;
    summary?: string;
    locale?: string;
  },
  options: WhatsAppTemplateInput = {},
) {
  return renderWhatsAppMessage(order, options);
}
