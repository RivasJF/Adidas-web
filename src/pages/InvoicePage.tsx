import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Printer, ArrowLeft, FileWarning, Home } from 'lucide-react';
import { InvoiceView } from '../components/InvoiceView';
import { useInvoice } from '../shared/context/invoice.context';
import { invoiceService, formatMXN } from '../service/invoiceService';

export const InvoicePage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getInvoiceById } = useInvoice();

  const invoice = useMemo(() => {
    if (!invoiceId) return undefined;
    return getInvoiceById(invoiceId) ?? invoiceService.getInvoice(invoiceId);
  }, [invoiceId, getInvoiceById]);

  // ?print=1 abre el diálogo de impresión (guardar como PDF) automáticamente
  useEffect(() => {
    if (searchParams.get('print') !== '1') return;
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  if (!invoice) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-gray-200 p-8 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center">
            <FileWarning className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Factura no encontrada
          </h1>
          <p className="text-sm text-gray-600">
            La factura solicitada no existe o fue eliminada de este dispositivo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-black text-white px-6 py-3.5 font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Volver a la Tienda
          </button>
        </div>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print bg-white border-b border-gray-200">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
              Sistema de Facturación
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Factura {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Total {formatMXN(invoice.total)} MXN ·{' '}
              <span
                className={
                  invoice.paymentStatus === 'Pagada'
                    ? 'text-green-600 font-bold'
                    : 'text-yellow-600 font-bold'
                }
              >
                {invoice.paymentStatus}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 border border-gray-300 px-5 py-3 text-sm font-black uppercase tracking-wider text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-black text-white px-5 py-3 text-sm font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer group"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Documento */}
      <div className="px-4 sm:px-6 py-8">
        <InvoiceView invoice={invoice} />
      </div>
    </main>
  );
};
