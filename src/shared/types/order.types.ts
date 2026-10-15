import type { CartItem } from './cart.types';

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  department: string;
  postalCode: string;
  notes?: string;
}

export type PaymentMethod = 'card' | 'transfer' | 'cash';

export interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  cardExp?: string;
  cardCvv?: string;
  transferBank?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerData;
  payment: PaymentData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  estimatedDelivery: string;
  status: 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado';
}

export interface OrderContextType {
  customerData: CustomerData | null;
  paymentData: PaymentData | null;
  currentOrder: Order | null;
  saveCustomerData: (data: CustomerData) => void;
  savePaymentData: (data: PaymentData) => void;
  createOrder: (items: CartItem[], total: number, subtotal: number, shipping: number) => Order;
  resetOrder: () => void;
}
