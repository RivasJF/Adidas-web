import type { PaymentMethod } from './order.types';

export type TaxRegime =
  | '601'
  | '603'
  | '605'
  | '606'
  | '608'
  | '612'
  | '614'
  | '616'
  | '620'
  | '621'
  | '622'
  | '626';

export const TAX_REGIMES: { value: TaxRegime; label: string }[] = [
  { value: '601', label: '601 - General de Ley Personas Morales' },
  { value: '603', label: '603 - Personas Morales con Fines No Lucrativos' },
  { value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { value: '606', label: '606 - Arrendamiento' },
  { value: '608', label: '608 - Demarcación Fiscal' },
  { value: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
  { value: '614', label: '614 - Ingresos por Dividendos' },
  { value: '616', label: '616 - Sin Obligaciones Fiscales' },
  { value: '620', label: '620 - Sociedades Cooperativas de Producción' },
  { value: '621', label: '621 - Incorporación Fiscal' },
  { value: '622', label: '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { value: '626', label: '626 - Régimen Simplificado de Confianza (RESICO)' },
];

export type CfdiUse =
  | 'G01'
  | 'G02'
  | 'G03'
  | 'I01'
  | 'I02'
  | 'I03'
  | 'I04'
  | 'I05'
  | 'D01'
  | 'D02'
  | 'D04'
  | 'D10'
  | 'P01'
  | 'S01';

export const CFDI_USES: { value: CfdiUse; label: string }[] = [
  { value: 'G01', label: 'G01 - Adquisición de mercancías' },
  { value: 'G02', label: 'G02 - Devoluciones, descuentos o bonificaciones' },
  { value: 'G03', label: 'G03 - Gastos en general' },
  { value: 'I01', label: 'I01 - Construcciones' },
  { value: 'I02', label: 'I02 - Mobiliario y equipo de oficina' },
  { value: 'I03', label: 'I03 - Equipo de transporte' },
  { value: 'I04', label: 'I04 - Equipo de computación y accesorios' },
  { value: 'I05', label: 'I05 - Herramientas' },
  { value: 'D01', label: 'D01 - Honorarios médicos, dentales y gastos hospitalarios' },
  { value: 'D02', label: 'D02 - Gastos médicos por incapacidad o discapacidad' },
  { value: 'D04', label: 'D04 - Donativos' },
  { value: 'D10', label: 'D10 - Pagos por servicios educativos (colegiaturas)' },
  { value: 'P01', label: 'P01 - Por definir' },
  { value: 'S01', label: 'S01 - Sin efectos fiscales' },
];

export interface BillingData {
  useShippingAddress: boolean;
  rfc: string;
  businessName: string;
  taxRegime: TaxRegime | '';
  cfdiUse: CfdiUse | '';
  billingEmail: string;
  fiscalAddress: string;
  fiscalCity: string;
  fiscalState: string;
  fiscalPostalCode: string;
}

export const DEFAULT_BILLING: BillingData = {
  useShippingAddress: true,
  rfc: '',
  businessName: '',
  taxRegime: '',
  cfdiUse: 'G03',
  billingEmail: '',
  fiscalAddress: '',
  fiscalCity: '',
  fiscalState: '',
  fiscalPostalCode: '',
};

export interface InvoiceIssuer {
  name: string;
  rfc: string;
  taxRegime: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceLine {
  productId: string;
  description: string;
  size: number | string;
  quantity: number;
  unitPrice: number; // precio con IVA incluido
  lineTotal: number;
}

export interface InvoiceTax {
  rate: number; // 0.16
  base: number; // subtotal gravable
  amount: number; // IVA
}

export type InvoiceStatus = 'Vigente' | 'Cancelada';
export type PaymentStatus = 'Pagada' | 'Pendiente de pago';

export interface Invoice {
  id: string;
  invoiceNumber: string; // FAC-2026-000001
  folioFiscal: string; // UUID simulado CFDI 4.0
  cfdiVersion: '4.0';
  issuedAt: string;
  issuedAtISO: string;
  orderNumber: string;
  issuer: InvoiceIssuer;
  receiver: BillingData;
  items: InvoiceLine[];
  currency: 'MXN';
  subtotal: number; // base gravable
  tax: InvoiceTax;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: InvoiceStatus;
  verificationCode: string;
}
