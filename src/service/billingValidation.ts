import type { BillingData } from '../shared/types/invoice.types';

export type BillingErrors = Partial<Record<keyof BillingData, string>>;

export const validateBilling = (value: BillingData): BillingErrors => {
  const errors: BillingErrors = {};
  const rfc = value.rfc.trim().toUpperCase();

  if (!rfc) {
    errors.rfc = 'Ingresa tu RFC';
  } else if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) {
    errors.rfc = 'RFC inválido (4 letras + 6 dígitos + 3 alfanuméricos)';
  }

  if (!value.businessName.trim()) {
    errors.businessName = 'Ingresa la razón social o nombre fiscal';
  }

  if (!value.taxRegime) errors.taxRegime = 'Selecciona el régimen fiscal';
  if (!value.cfdiUse) errors.cfdiUse = 'Selecciona el uso de CFDI';

  if (!value.billingEmail.trim()) {
    errors.billingEmail = 'Ingresa el correo para enviar la factura';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.billingEmail.trim())) {
    errors.billingEmail = 'El correo no es válido';
  }

  if (!value.useShippingAddress) {
    if (!value.fiscalAddress.trim()) errors.fiscalAddress = 'Ingresa el domicilio fiscal';
    if (!value.fiscalCity.trim()) errors.fiscalCity = 'Ingresa la ciudad fiscal';
    if (!value.fiscalState.trim()) errors.fiscalState = 'Ingresa el estado fiscal';
    if (!/^\d{5}$/.test(value.fiscalPostalCode.trim())) {
      errors.fiscalPostalCode = 'Código postal de 5 dígitos';
    }
  }

  return errors;
};
