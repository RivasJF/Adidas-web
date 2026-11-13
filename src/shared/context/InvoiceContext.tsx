import React, { useState, useCallback } from 'react';
import { InvoiceContext } from './invoice.context';
import { invoiceService } from '../../service/invoiceService';
import type { Invoice } from '../types/invoice.types';
import type { Order } from '../types/order.types';

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => invoiceService.listInvoices());
  const [latestInvoice, setLatestInvoice] = useState<Invoice | null>(null);

  const refreshInvoices = useCallback(() => {
    setInvoices(invoiceService.listInvoices());
  }, []);

  const createInvoiceFromOrder = useCallback((order: Order): Invoice => {
    // Reutilizar factura existente para el mismo pedido (evita duplicados al recargar)
    const existing = invoiceService.getByOrderNumber(order.orderNumber);
    if (existing) {
      setLatestInvoice(existing);
      return existing;
    }
    const invoice = invoiceService.createInvoice(order, order.billing);
    invoiceService.saveInvoice(invoice);
    setLatestInvoice(invoice);
    setInvoices(invoiceService.listInvoices());
    return invoice;
  }, []);

  const getInvoiceById = useCallback(
    (id: string): Invoice | undefined => invoiceService.getInvoice(id),
    []
  );

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        latestInvoice,
        createInvoiceFromOrder,
        getInvoiceById,
        refreshInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
