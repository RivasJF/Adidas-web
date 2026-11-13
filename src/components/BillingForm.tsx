import React from 'react';
import { ReceiptText, Building2, Mail, MapPin, AlertCircle } from 'lucide-react';
import type { BillingData, CfdiUse, TaxRegime } from '../shared/types/invoice.types';
import { TAX_REGIMES, CFDI_USES } from '../shared/types/invoice.types';
import type { CustomerData } from '../shared/types/order.types';
import type { BillingErrors } from '../service/billingValidation';

interface BillingFormProps {
  value: BillingData;
  onChange: (value: BillingData) => void;
  errors: BillingErrors;
  touched: boolean;
  customer: CustomerData;
  onValidate: () => void;
}

export const BillingForm: React.FC<BillingFormProps> = ({
  value,
  onChange,
  errors,
  touched,
  customer,
  onValidate,
}) => {
  const update = (field: keyof BillingData, fieldValue: string | boolean) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const handleBlur = () => onValidate();

  const fieldClass = (field: keyof BillingData) =>
    `w-full px-4 py-3 border text-sm font-medium bg-white outline-none transition-all ${
      errors[field] && touched
        ? 'border-red-500 focus:border-red-500 bg-red-50'
        : 'border-gray-300 focus:border-black'
    }`;

  const showError = (field: keyof BillingData) =>
    touched && errors[field] ? (
      <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
        <AlertCircle className="w-3 h-3" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600">
          <ReceiptText className="w-3.5 h-3.5" />
          Datos de Facturación (CFDI)
        </p>
        <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={value.useShippingAddress}
            onChange={(e) => update('useShippingAddress', e.target.checked)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          Usar dirección de envío
        </label>
      </div>

      <div className="space-y-5">
        {/* RFC y Razón social */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rfc" className="block text-xs font-semibold text-gray-500 mb-1.5">
              RFC (Persona física o moral)
            </label>
            <input
              id="rfc"
              name="rfc"
              type="text"
              maxLength={13}
              autoComplete="off"
              value={value.rfc}
              onChange={(e) => update('rfc', e.target.value.toUpperCase())}
              onBlur={handleBlur}
              className={fieldClass('rfc')}
              placeholder="XAXX010101000"
            />
            {showError('rfc')}
          </div>

          <div>
            <label htmlFor="businessName" className="block text-xs font-semibold text-gray-500 mb-1.5">
              Razón social / Nombre fiscal
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              autoComplete="organization"
              value={value.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              onBlur={handleBlur}
              className={fieldClass('businessName')}
              placeholder="Juan Pérez López"
            />
            {showError('businessName')}
          </div>
        </div>

        {/* Régimen fiscal y Uso de CFDI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="taxRegime" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Régimen fiscal
            </label>
            <select
              id="taxRegime"
              name="taxRegime"
              value={value.taxRegime}
              onChange={(e) => update('taxRegime', e.target.value as TaxRegime)}
              onBlur={handleBlur}
              className={fieldClass('taxRegime')}
            >
              <option value="">Selecciona tu régimen</option>
              {TAX_REGIMES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {showError('taxRegime')}
          </div>

          <div>
            <label htmlFor="cfdiUse" className="block text-xs font-semibold text-gray-500 mb-1.5">
              Uso de CFDI
            </label>
            <select
              id="cfdiUse"
              name="cfdiUse"
              value={value.cfdiUse}
              onChange={(e) => update('cfdiUse', e.target.value as CfdiUse)}
              onBlur={handleBlur}
              className={fieldClass('cfdiUse')}
            >
              <option value="">Selecciona el uso</option>
              {CFDI_USES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
            {showError('cfdiUse')}
          </div>
        </div>

        {/* Correo de facturación */}
        <div className="sm:max-w-sm">
          <label htmlFor="billingEmail" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
            <Mail className="w-3.5 h-3.5" />
            Correo para envío de factura
          </label>
          <input
            id="billingEmail"
            name="billingEmail"
            type="email"
            autoComplete="email"
            value={value.billingEmail}
            onChange={(e) => update('billingEmail', e.target.value)}
            onBlur={handleBlur}
            className={fieldClass('billingEmail')}
            placeholder={customer.email || 'facturas@ejemplo.com'}
          />
          {showError('billingEmail')}
        </div>

        {/* Dirección fiscal */}
        {!value.useShippingAddress && (
          <div className="pt-3 border-t border-gray-100">
            <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Domicilio Fiscal
            </p>
            <div className="space-y-5">
              <div>
                <label htmlFor="fiscalAddress" className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Calle y número
                </label>
                <input
                  id="fiscalAddress"
                  name="fiscalAddress"
                  type="text"
                  value={value.fiscalAddress}
                  onChange={(e) => update('fiscalAddress', e.target.value)}
                  onBlur={handleBlur}
                  className={fieldClass('fiscalAddress')}
                  placeholder="Av. Reforma 250, Col. Juárez"
                />
                {showError('fiscalAddress')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="fiscalCity" className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Ciudad
                  </label>
                  <input
                    id="fiscalCity"
                    name="fiscalCity"
                    type="text"
                    value={value.fiscalCity}
                    onChange={(e) => update('fiscalCity', e.target.value)}
                    onBlur={handleBlur}
                    className={fieldClass('fiscalCity')}
                    placeholder="Ciudad de México"
                  />
                  {showError('fiscalCity')}
                </div>

                <div>
                  <label htmlFor="fiscalState" className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Estado
                  </label>
                  <input
                    id="fiscalState"
                    name="fiscalState"
                    type="text"
                    value={value.fiscalState}
                    onChange={(e) => update('fiscalState', e.target.value)}
                    onBlur={handleBlur}
                    className={fieldClass('fiscalState')}
                    placeholder="CDMX"
                  />
                  {showError('fiscalState')}
                </div>

                <div>
                  <label htmlFor="fiscalPostalCode" className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Código postal
                  </label>
                  <input
                    id="fiscalPostalCode"
                    name="fiscalPostalCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={value.fiscalPostalCode}
                    onChange={(e) => update('fiscalPostalCode', e.target.value.replace(/\D/g, ''))}
                    onBlur={handleBlur}
                    className={fieldClass('fiscalPostalCode')}
                    placeholder="06600"
                  />
                  {showError('fiscalPostalCode')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
