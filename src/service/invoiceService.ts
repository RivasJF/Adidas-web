import type { Order, CustomerData, PaymentMethod } from '../shared/types/order.types';
import type {
  BillingData,
  Invoice,
  InvoiceIssuer,
  InvoiceLine,
} from '../shared/types/invoice.types';

const IVA_RATE = 0.16;

const INVOICES_STORAGE_KEY = 'adidas_invoices';
const INVOICE_COUNTER_KEY = 'adidas_invoice_counter';

// RFC genérico "público en general" usado cuando no hay datos fiscales
export const PUBLIC_RFC = 'XAXX010101000';

export const ISSUER: InvoiceIssuer = {
  name: 'ADIDAS MÉXICO, S.A. DE C.V.',
  rfc: 'A80930442462',
  taxRegime: '601',
  address: 'Av. Paseo de la Reforma 250, Col. Juárez, C.P. 06600, Ciudad de México',
  phone: '+52 (55) 1234 5678',
  email: 'facturacion@adidasstore.mx',
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

const uuid = (): string => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const readInvoices = (): Invoice[] => {
  try {
    const stored = localStorage.getItem(INVOICES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Invoice[]) : [];
  } catch {
    return [];
  }
};

const writeInvoices = (invoices: Invoice[]): void => {
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving invoices to localStorage', e);
  }
};

export const invoiceService = {
  /** Precios del catálogo ya incluyen IVA; se separa la base gravable */
  calcTaxes(totalWithIva: number): { subtotal: number; iva: number } {
    const total = round2(totalWithIva);
    const subtotal = round2(total / (1 + IVA_RATE));
    return { subtotal, iva: round2(total - subtotal) };
  },

  nextInvoiceNumber(): string {
    let counter: number;
    try {
      const stored = localStorage.getItem(INVOICE_COUNTER_KEY);
      const previous = stored ? Number(stored) : 0;
      counter = Number.isFinite(previous) && previous > 0 ? previous + 1 : 1;
      localStorage.setItem(INVOICE_COUNTER_KEY, String(counter));
    } catch {
      counter = Math.floor(Date.now() % 1000000);
    }
    const year = new Date().getFullYear();
    return `FAC-${year}-${String(counter).padStart(6, '0')}`;
  },

  validateRFC(rfc: string): boolean {
    return /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim().toUpperCase());
  },

  buildBillingFromCustomer(customer: CustomerData): BillingData {
    return {
      useShippingAddress: true,
      rfc: PUBLIC_RFC,
      businessName: `${customer.firstName} ${customer.lastName}`.trim(),
      taxRegime: '616',
      cfdiUse: 'S01',
      billingEmail: customer.email,
      fiscalAddress: customer.address,
      fiscalCity: customer.city,
      fiscalState: customer.department,
      fiscalPostalCode: customer.postalCode,
    };
  },

  createInvoice(order: Order, billing: BillingData | null): Invoice {
    const receiver: BillingData =
      billing && billing.rfc.trim()
        ? {
            ...billing,
            rfc: billing.rfc.trim().toUpperCase(),
            businessName: billing.businessName.trim(),
            billingEmail: billing.billingEmail.trim() || order.customer.email,
          }
        : this.buildBillingFromCustomer(order.customer);

    const items: InvoiceLine[] = order.items.map((item) => ({
      productId: item.product.id,
      description: item.product.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineTotal: round2(item.product.price * item.quantity),
    }));

    // Los precios del catálogo incluyen IVA: la base gravable se deriva del total
    const gross = round2(
      items.reduce((acc, line) => acc + line.lineTotal, 0) +
        order.shipping -
        order.discount
    );
    const { subtotal, iva } = this.calcTaxes(gross);
    const total = gross; // subtotal + iva (el envío también queda gravado)

    const now = new Date();
    const paymentMethod: PaymentMethod = order.payment.method;
    const isCash = paymentMethod === 'cash';

    return {
      id: uuid(),
      invoiceNumber: this.nextInvoiceNumber(),
      folioFiscal: uuid().toUpperCase(),
      cfdiVersion: '4.0',
      issuedAt: now.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      issuedAtISO: now.toISOString(),
      orderNumber: order.orderNumber,
      issuer: ISSUER,
      receiver,
      items,
      currency: 'MXN',
      subtotal,
      tax: { rate: IVA_RATE, base: subtotal, amount: iva },
      shipping: order.shipping,
      discount: order.discount,
      total,
      paymentMethod,
      paymentStatus: isCash ? 'Pendiente de pago' : 'Pagada',
      status: 'Vigente',
      verificationCode: uuid().replace(/-/g, '').slice(0, 12).toUpperCase(),
    };
  },

  saveInvoice(invoice: Invoice): void {
    const invoices = readInvoices();
    const index = invoices.findIndex((i) => i.id === invoice.id);
    if (index >= 0) {
      invoices[index] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    writeInvoices(invoices);
  },

  getInvoice(id: string): Invoice | undefined {
    return readInvoices().find((i) => i.id === id);
  },

  getByOrderNumber(orderNumber: string): Invoice | undefined {
    return readInvoices().find((i) => i.orderNumber === orderNumber);
  },

  listInvoices(): Invoice[] {
    return readInvoices();
  },
};

export const formatMXN = (value: number): string =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value);

export const formatTaxRegime = (value: string): string => {
  const map: Record<string, string> = {
    '601': '601 - General de Ley Personas Morales',
    '603': '603 - Personas Morales con Fines No Lucrativos',
    '605': '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
    '606': '606 - Arrendamiento',
    '608': '608 - Demarcación Fiscal',
    '612': '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    '614': '614 - Ingresos por Dividendos',
    '616': '616 - Sin Obligaciones Fiscales',
    '620': '620 - Sociedades Cooperativas de Producción',
    '621': '621 - Incorporación Fiscal',
    '622': '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    '626': '626 - Régimen Simplificado de Confianza (RESICO)',
  };
  return value ? (map[value] ?? value) : '616 - Sin Obligaciones Fiscales';
};

export const formatCfdiUse = (value: string): string => {
  const map: Record<string, string> = {
    G01: 'G01 - Adquisición de mercancías',
    G02: 'G02 - Devoluciones, descuentos o bonificaciones',
    G03: 'G03 - Gastos en general',
    I01: 'I01 - Construcciones',
    I02: 'I02 - Mobiliario y equipo de oficina',
    I03: 'I03 - Equipo de transporte',
    I04: 'I04 - Equipo de computación y accesorios',
    I05: 'I05 - Herramientas',
    D01: 'D01 - Honorarios médicos, dentales y gastos hospitalarios',
    D02: 'D02 - Gastos médicos por incapacidad o discapacidad',
    D04: 'D04 - Donativos',
    D10: 'D10 - Pagos por servicios educativos (colegiaturas)',
    P01: 'P01 - Por definir',
    S01: 'S01 - Sin efectos fiscales',
  };
  return value ? (map[value] ?? value) : 'P01 - Por definir';
};
