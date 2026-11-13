import { createContext, useContext } from 'react';
import type { Invoice } from '../types/invoice.types';
import type { Order } from '../types/order.types';

export interface InvoiceContextType {
  invoices: Invoice[];
  latestInvoice: Invoice | null;
  createInvoiceFromOrder: (order: Order) => Invoice;
  getInvoiceById: (id: string) => Invoice | undefined;
  refreshInvoices: () => void;
}

export const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice debe ser usado dentro de un InvoiceProvider');
  }
  return context;
};
