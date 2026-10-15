import { createContext, useContext } from 'react';
import type { OrderContextType } from '../types/order.types';

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe ser usado dentro de un OrderProvider');
  }
  return context;
};
