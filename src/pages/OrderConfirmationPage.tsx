import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  Landmark,
  Mail,
  CalendarClock,
  ArrowRight,
  Home,
} from 'lucide-react';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { useOrder } from '../shared/context/order.context';
import type { PaymentMethod } from '../shared/types/order.types';

const paymentLabel: Record<PaymentMethod, { text: string; icon: React.ReactNode }> = {
  card: { text: 'Tarjeta de Crédito / Débito', icon: <CreditCard className="w-4 h-4" /> },
  transfer: { text: 'Transferencia Bancaria', icon: <Landmark className="w-4 h-4" /> },
  cash: { text: 'Pago Contra Entrega', icon: <Banknote className="w-4 h-4" /> },
};

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, resetOrder } = useOrder();

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentOrder) return null;

  const order = currentOrder;
  const payment = paymentLabel[order.payment.method] ?? paymentLabel.card;

  const handleBackToStore = () => {
    resetOrder();
    navigate('/');
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <CheckoutStepper />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success hero */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-500 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
          <span className="inline-block bg-black text-white text-xs font-black px-4 py-1.5 uppercase tracking-[0.25em] mb-4">
            Paso 3 de 3 — Completado
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mb-3">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Gracias por tu compra, <strong>{order.customer.firstName}</strong>.
            Hemos recibido tu pedido y te enviaremos las novedades a{' '}
            <strong>{order.customer.email}</strong>.
          </p>

          <div className="inline-flex items-center gap-3 mt-6 bg-white border-2 border-black px-6 py-3">
            <Package className="w-5 h-5" />
            <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">
              Número de pedido
            </span>
            <span className="text-xl font-black tracking-widest">{order.orderNumber}</span>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5 text-center">
            <CalendarClock className="w-6 h-6 mx-auto mb-2 text-black" />
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
              Fecha del pedido
            </p>
            <p className="text-sm font-black">{order.date}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5 text-center">
            <Truck className="w-6 h-6 mx-auto mb-2 text-black" />
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
              Entrega estimada
            </p>
            <p className="text-sm font-black capitalize">{order.estimatedDelivery}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5 text-center">
            <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center text-black">
              {payment.icon}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
              Método de pago
            </p>
            <p className="text-sm font-black">{payment.text}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order items */}
          <section className="bg-white border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 font-black uppercase tracking-wider mb-5">
              <Package className="w-5 h-5" />
              Productos ({order.items.reduce((a, i) => a + i.quantity, 0)})
            </h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black">{item.product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.product.category} · {item.product.target}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Talla <strong className="text-black">{item.size}</strong> · Cantidad:{' '}
                      <strong className="text-black">{item.quantity}</strong>
                    </p>
                  </div>
                  <span className="font-black text-sm whitespace-nowrap">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-bold">
                  {order.shipping === 0 ? <span className="text-green-600">GRATIS</span> : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento</span>
                  <span className="font-bold text-green-600">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg border-t border-gray-300 pt-3">
                <span className="font-black uppercase">Total Pagado</span>
                <span className="font-black">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Customer & delivery info */}
          <section className="space-y-6">
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 font-black uppercase tracking-wider mb-5">
                <MapPin className="w-5 h-5" />
                Dirección de Entrega
              </h2>
              <div className="text-sm space-y-1 text-gray-700">
                <p className="font-black text-black text-base">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>{order.customer.address}</p>
                {order.customer.apartment && <p>{order.customer.apartment}</p>}
                <p>
                  {order.customer.city}, {order.customer.department} — C.P.{' '}
                  {order.customer.postalCode}
                </p>
                <p className="pt-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {order.customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  {order.customer.phone}
                </p>
              </div>
              {order.customer.notes && (
                <div className="mt-4 bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
                  <strong>Notas:</strong> {order.customer.notes}
                </div>
              )}
            </div>

            {/* Status timeline */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 font-black uppercase tracking-wider mb-5">
                <Truck className="w-5 h-5" />
                Estado del Envío
              </h2>
              <ol className="space-y-4">
                {['Confirmado', 'En preparación', 'En camino', 'Entregado'].map(
                  (stage, index) => {
                    const currentStageIndex = ['Confirmado', 'En preparación', 'En camino', 'Entregado'].indexOf(
                      order.status
                    );
                    const isDone = index <= currentStageIndex;
                    return (
                      <li key={stage} className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            isDone
                              ? 'bg-black border-black'
                              : 'bg-white border-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm font-bold uppercase tracking-wide ${
                            isDone ? 'text-black' : 'text-gray-400'
                          }`}
                        >
                          {stage}
                        </span>
                        {index === currentStageIndex && (
                          <span className="ml-auto bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                            Actual
                          </span>
                        )}
                      </li>
                    );
                  }
                )}
              </ol>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={handleBackToStore}
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer group"
          >
            <Home className="w-5 h-5" />
            Volver a la Tienda
          </button>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-black px-6 py-4 font-black uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
          >
            Seguir Comprando
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Se enviaron los detalles del pedido a {order.customer.email} · ¿Necesitas ayuda? Contáctanos en soporte@adidasstore.com
        </p>
      </div>
    </main>
  );
};
