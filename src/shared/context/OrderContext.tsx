import React, { useState, useEffect } from 'react';
import { OrderContext } from './order.context';
import type { CustomerData, Order, PaymentData } from '../types/order.types';
import type { CartItem } from '../types/cart.types';

const CUSTOMER_STORAGE_KEY = 'adidas_checkout_customer';
const ORDER_STORAGE_KEY = 'adidas_latest_order';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (customerData) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData));
    }
  }, [customerData]);

  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(currentOrder));
    }
  }, [currentOrder]);

  const saveCustomerData = (data: CustomerData) => {
    setCustomerData(data);
  };

  const savePaymentData = (data: PaymentData) => {
    setPaymentData(data);
  };

  const createOrder = (
    items: CartItem[],
    total: number,
    subtotal: number,
    shipping: number
  ): Order => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ADI-${randomSuffix}`;

    // Fecha estimada: 4 días hábiles desde hoy
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDelivery = deliveryDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newOrder: Order = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()),
      orderNumber,
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customer: customerData || {
        firstName: 'Cliente',
        lastName: 'Adidas',
        email: 'cliente@adidas.com',
        phone: '1234567890',
        address: 'Calle Principal #123',
        city: 'Ciudad',
        department: 'Departamento',
        postalCode: '10001',
      },
      payment: paymentData || { method: 'card' },
      items: [...items],
      subtotal,
      shipping,
      discount: 0,
      total,
      estimatedDelivery,
      status: 'Confirmado',
    };

    setCurrentOrder(newOrder);
    return newOrder;
  };

  const resetOrder = () => {
    setCurrentOrder(null);
    setPaymentData(null);
    localStorage.removeItem(ORDER_STORAGE_KEY);
  };

  return (
    <OrderContext.Provider
      value={{
        customerData,
        paymentData,
        currentOrder,
        saveCustomerData,
        savePaymentData,
        createOrder,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
