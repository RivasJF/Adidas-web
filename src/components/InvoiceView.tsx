import React from 'react';
import {
  CreditCard,
  Landmark,
  Banknote,
  ShieldCheck,
  CalendarDays,
  Hash,
} from 'lucide-react';
import type { Invoice } from '../shared/types/invoice.types';
import type { PaymentMethod } from '../shared/types/order.types';
import { formatMXN, formatTaxRegime, formatCfdiUse } from '../service/invoiceService';

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Tarjeta de Crédito / Débito',
  transfer: 'Transferencia Bancaria',
  cash: 'Efectivo contra entrega',
};

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  card: <CreditCard className="w-3.5 h-3.5" />,
  transfer: <Landmark className="w-3.5 h-3.5" />,
  cash: <Banknote className="w-3.5 h-3.5" />,
};

interface InvoiceViewProps {
  invoice: Invoice;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice }) => {
  const ivaPercent = Math.round(invoice.tax.rate * 100);

  return (
    <div className="invoice-sheet bg-white text-black border border-gray-300 shadow-xl w-full max-w-[820px] mx-auto">
      {/* Cintillo superior */}
      <div className="bg-black text-white px-6 py-3 flex items-center justify-between print:bg-white print:text-black print:border-b-2 print:border-black">
        <div className="flex items-center gap-3">
          <svg className="w-9 h-7 fill-current text-white print:text-black" viewBox="0 0 48 32" aria-hidden="true">
            <path d="M4.5 28L12 16.5H18L10.5 28H4.5Z" />
            <path d="M16 28L26 10H32L22 28H16Z" />
            <path d="M28 28L40 4H46L34 28H28Z" />
          </svg>
          <span className="font-black text-lg tracking-tighter uppercase">adidas</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.25em]">Factura / CFDI {invoice.cfdiVersion}</p>
          <p className="text-[10px] text-gray-300 print:text-gray-600 uppercase tracking-widest">
            Comprobante fiscal digital
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Emisor + Folio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1 text-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Emisor
            </p>
            <p className="font-black text-base uppercase leading-tight">{invoice.issuer.name}</p>
            <p className="text-gray-700">
              <strong>RFC:</strong> {invoice.issuer.rfc}
            </p>
            <p className="text-gray-700">
              <strong>Régimen:</strong> {formatTaxRegime(invoice.issuer.taxRegime)}
            </p>
            <p className="text-gray-700">{invoice.issuer.address}</p>
            <p className="text-gray-700">
              Tel. {invoice.issuer.phone} · {invoice.issuer.email}
            </p>
          </div>

          <div className="border border-gray-300 p-4 space-y-2.5 text-sm bg-gray-50">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 font-semibold">Folio fiscal (UUID)</span>
              <span className="font-mono text-[11px] font-bold break-all text-right">
                {invoice.folioFiscal}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 font-semibold">N.° de factura</span>
              <span className="font-black">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 font-semibold">Fecha de emisión</span>
              <span className="font-bold">{invoice.issuedAt}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 font-semibold">Pedido asociado</span>
              <span className="font-bold">{invoice.orderNumber}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500 font-semibold">Método de pago</span>
              <span className="font-bold flex items-center gap-1.5">
                {paymentIcons[invoice.paymentMethod]}
                {paymentLabels[invoice.paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between gap-3 border-t border-gray-300 pt-2">
              <span className="text-gray-500 font-semibold">Estado</span>
              <span
                className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 ${
                  invoice.paymentStatus === 'Pagada'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Receptor */}
        <div className="border border-gray-300 p-4 text-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Receptor
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <p>
              <strong>Nombre / Razón social:</strong> {invoice.receiver.businessName}
            </p>
            <p>
              <strong>RFC:</strong> {invoice.receiver.rfc}
            </p>
            <p>
              <strong>Régimen fiscal:</strong> {formatTaxRegime(invoice.receiver.taxRegime)}
            </p>
            <p>
              <strong>Uso de CFDI:</strong> {formatCfdiUse(invoice.receiver.cfdiUse)}
            </p>
            <p>
              <strong>Correo:</strong> {invoice.receiver.billingEmail}
            </p>
            <p>
              <strong>Domicilio fiscal:</strong>{' '}
              {invoice.receiver.fiscalAddress}, {invoice.receiver.fiscalCity},{' '}
              {invoice.receiver.fiscalState}, C.P. {invoice.receiver.fiscalPostalCode}
            </p>
          </div>
        </div>

        {/* Conceptos */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-black text-white print:bg-gray-200 print:text-black">
                <th className="px-3 py-2.5 text-left font-black uppercase text-[10px] tracking-widest border">
                  #
                </th>
                <th className="px-3 py-2.5 text-left font-black uppercase text-[10px] tracking-widest border">
                  Concepto
                </th>
                <th className="px-3 py-2.5 text-center font-black uppercase text-[10px] tracking-widest border">
                  Cant.
                </th>
                <th className="px-3 py-2.5 text-center font-black uppercase text-[10px] tracking-widest border">
                  Talla
                </th>
                <th className="px-3 py-2.5 text-right font-black uppercase text-[10px] tracking-widest border">
                  P. Unit.
                </th>
                <th className="px-3 py-2.5 text-right font-black uppercase text-[10px] tracking-widest border">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((line, index) => (
                <tr key={`${line.productId}-${line.size}-${index}`} className="even:bg-gray-50">
                  <td className="px-3 py-2.5 border border-gray-300 text-center font-bold">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5 border border-gray-300">
                    <span className="font-bold">{line.description}</span>
                    <span className="block text-[11px] text-gray-500">{line.productId}</span>
                  </td>
                  <td className="px-3 py-2.5 border border-gray-300 text-center font-bold">
                    {line.quantity}
                  </td>
                  <td className="px-3 py-2.5 border border-gray-300 text-center font-bold">
                    {line.size}
                  </td>
                  <td className="px-3 py-2.5 border border-gray-300 text-right">
                    {formatMXN(line.unitPrice)}
                  </td>
                  <td className="px-3 py-2.5 border border-gray-300 text-right font-black">
                    {formatMXN(line.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          {/* Sello / verificación */}
          <div className="flex-1 space-y-2 text-[11px] text-gray-600">
            <p className="flex items-center gap-1.5 font-bold text-gray-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Código de verificación
            </p>
            <p className="font-mono font-bold text-xs tracking-wider">{invoice.verificationCode}</p>
            <p className="leading-relaxed">
              Este documento es una representación impresa de un CFDI {invoice.cfdiVersion}.
              La autenticidad de este comprobante puede verificarse en el portal del SAT.
            </p>
            <p className="flex items-center gap-1.5 pt-1">
              <Hash className="w-3.5 h-3.5" />
              Demostración académica — sin validez fiscal real.
            </p>
          </div>

          <div className="sm:min-w-[280px] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal (base gravable)</span>
              <span className="font-bold">{formatMXN(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA {ivaPercent}%</span>
              <span className="font-bold">{formatMXN(invoice.tax.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span className="font-bold">
                {invoice.shipping === 0 ? 'GRATIS' : formatMXN(invoice.shipping)}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento</span>
                <span className="font-bold text-green-600">
                  -{formatMXN(invoice.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-black pt-2.5 mt-1">
              <span className="font-black uppercase tracking-wider">Total</span>
              <span className="font-black text-lg">{formatMXN(invoice.total)} MXN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="border-t border-gray-300 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-500 uppercase tracking-widest print:text-black">
        <span>{invoice.issuer.name}</span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3" /> Emitida {invoice.issuedAt}
        </span>
        <span>Factura {invoice.invoiceNumber}</span>
      </div>
    </div>
  );
};
