import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Landmark,
  Banknote,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { useCart } from '../shared/context/cart.context';
import { useOrder } from '../shared/context/order.context';
import type { PaymentMethod } from '../shared/types/order.types';

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

interface PaymentErrors {
  cardNumber?: string;
  cardHolder?: string;
  cardExp?: string;
  cardCvv?: string;
  transferBank?: string;
}

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, totalItems, clearCart } = useCart();
  const { customerData, savePaymentData, createOrder } = useOrder();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [transferBank, setTransferBank] = useState('');
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirigir si faltan datos previos
  useEffect(() => {
    if (items.length === 0 && !localStorage.getItem('adidas_latest_order')) {
      navigate('/');
      return;
    }
    if (!customerData) {
      navigate('/checkout/datos');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): boolean => {
    const newErrors: PaymentErrors = {};

    if (method === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length < 15) newErrors.cardNumber = 'Número de tarjeta incompleto (mín. 15 dígitos)';
      if (!cardHolder.trim()) newErrors.cardHolder = 'Ingresa el nombre del titular';
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) newErrors.cardExp = 'Formato MM/AA';
      else {
        const [mm, yy] = cardExp.split('/').map(Number);
        if (mm < 1 || mm > 12) newErrors.cardExp = 'Mes inválido (01-12)';
        const fullYear = 2000 + yy;
        const now = new Date();
        if (fullYear < now.getFullYear() || (fullYear === now.getFullYear() && mm < now.getMonth() + 1)) {
          newErrors.cardExp = 'La tarjeta está vencida';
        }
      }
      if (!/^\d{3,4}$/.test(cardCvv)) newErrors.cardCvv = 'CVV de 3 o 4 dígitos';
    }

    if (method === 'transfer' && !transferBank) {
      newErrors.transferBank = 'Selecciona el banco de origen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!customerData) {
      navigate('/checkout/datos');
      return;
    }

    setIsProcessing(true);

    // Simulación de procesamiento de pago (2s)
    setTimeout(() => {
      savePaymentData({
        method,
        cardNumber: method === 'card' ? cardNumber.replace(/\s/g, '') : undefined,
        cardHolder: method === 'card' ? cardHolder : undefined,
        cardExp: method === 'card' ? cardExp : undefined,
        transferBank: method === 'transfer' ? transferBank : undefined,
      });

      const order = createOrder(items, total, subtotal, shipping);

      // Vaciar carrito y persistir la orden antes de navegar
      clearCart();
      setIsProcessing(false);
      navigate('/checkout/confirmacion', { state: { orderId: order.id } });
    }, 2000);
  };

  const methodOptions: { value: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'card',
      label: 'Tarjeta de Crédito / Débito',
      desc: 'Visa, Mastercard, Amex. Procesamiento inmediato.',
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      value: 'transfer',
      label: 'Transferencia Bancaria',
      desc: 'PSE, SPEI, Nequi, Daviplata y más.',
      icon: <Landmark className="w-6 h-6" />,
    },
    {
      value: 'cash',
      label: 'Pago Contra Entrega',
      desc: 'Paga en efectivo al recibir tu pedido.',
      icon: <Banknote className="w-6 h-6" />,
    },
  ];

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-3 border text-sm font-medium bg-white outline-none transition-all ${
      hasError ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'
    }`;

  return (
    <main className="bg-gray-50 min-h-screen">
      <CheckoutStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
            Paso 2 de 3
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Pasarela de Pago
          </h1>
          <p className="text-gray-600 mt-2">
            Selecciona tu método de pago preferido.{' '}
            <span className="text-xs uppercase font-bold text-gray-400">
              (Demostración — no se procesan pagos reales)
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Method selector */}
              <div className="bg-white border border-gray-200 p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">
                  Método de pago
                </p>
                {methodOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${
                      method === opt.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={method === opt.value}
                      onChange={() => setMethod(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        method === opt.value ? 'border-white' : 'border-gray-300'
                      }`}
                    >
                      {method === opt.value && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="flex-shrink-0">{opt.icon}</span>
                    <span>
                      <span className="block font-bold text-sm uppercase tracking-wide">
                        {opt.label}
                      </span>
                      <span className={`block text-xs ${method === opt.value ? 'text-gray-300' : 'text-gray-500'}`}>
                        {opt.desc}
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {/* Card form */}
              {method === 'card' && (
                <div className="bg-white border border-gray-200 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-600">
                      Datos de la tarjeta
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                      Simulación segura
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Número de tarjeta
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className={inputClass(errors.cardNumber)}
                      placeholder="4242 4242 4242 4242"
                    />
                    {errors.cardNumber && (
                      <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cardHolder" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Nombre del titular
                    </label>
                    <input
                      id="cardHolder"
                      name="cardHolder"
                      type="text"
                      autoComplete="cc-name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className={inputClass(errors.cardHolder)}
                      placeholder="LIONEL MESSI"
                    />
                    {errors.cardHolder && (
                      <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.cardHolder}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExp" className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Vencimiento (MM/AA)
                      </label>
                      <input
                        id="cardExp"
                        name="cardExp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={cardExp}
                        onChange={(e) => setCardExp(formatExpiry(e.target.value))}
                        className={inputClass(errors.cardExp)}
                        placeholder="12/28"
                      />
                      {errors.cardExp && (
                        <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.cardExp}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cardCvv" className="block text-xs font-semibold text-gray-500 mb-1.5">
                        CVV
                      </label>
                      <input
                        id="cardCvv"
                        name="cardCvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className={inputClass(errors.cardCvv)}
                        placeholder="•••"
                      />
                      {errors.cardCvv && (
                        <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.cardCvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer form */}
              {method === 'transfer' && (
                <div className="bg-white border border-gray-200 p-6 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-600">
                    Banco de origen
                  </p>
                  <div>
                    <select
                      id="transferBank"
                      name="transferBank"
                      value={transferBank}
                      onChange={(e) => setTransferBank(e.target.value)}
                      className={inputClass(errors.transferBank)}
                    >
                      <option value="">Selecciona tu banco</option>
                      <option value="bancolombia">Bancolombia</option>
                      <option value="davivienda">Davivienda</option>
                      <option value="banco-bogota">Banco de Bogotá</option>
                      <option value="bbva">BBVA Colombia</option>
                      <option value="itau">Itaú</option>
                      <option value="nequi">Nequi</option>
                      <option value="daviplata">Daviplata</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.transferBank && (
                      <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.transferBank}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
                    Una vez confirmado el pedido recibirás los datos de cuenta
                    destino en pantalla y por correo electrónico.
                  </div>
                </div>
              )}

              {/* Cash info */}
              {method === 'cash' && (
                <div className="bg-white border border-gray-200 p-6 space-y-3">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-600">
                    Pago contra entrega
                  </p>
                  <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    Nuestro mensajero llevará el cambio exacto. Asegúrate de
                    tener el monto total de <strong>${total.toFixed(2)}</strong>{' '}
                    en efectivo al momento de la entrega.
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/checkout/datos')}
                  className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando Pago...
                    </>
                  ) : (
                    <>
                      Confirmar Pedido — ${total.toFixed(2)}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <p className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                <Lock className="w-3.5 h-3.5" />
                Este es un entorno demostrativo. No se almacena ni procesa información real.
              </p>
            </form>
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-32 space-y-5">
              <div className="pb-3 border-b border-gray-200">
                <h2 className="font-black uppercase tracking-wider">
                  Resumen
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
              </div>

              {customerData && (
                <div className="text-sm space-y-1 pb-3 border-b border-gray-100">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">
                    Entregar a
                  </p>
                  <p className="font-bold">{customerData.firstName} {customerData.lastName}</p>
                  <p className="text-gray-600 text-xs">{customerData.address}</p>
                  <p className="text-gray-600 text-xs">
                    {customerData.city}, {customerData.department} — {customerData.postalCode}
                  </p>
                </div>
              )}

              <ul className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <div className="w-14 h-14 flex-shrink-0 bg-gray-100 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-gray-500">Talla {item.size} · ×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-bold">
                    {shipping === 0 ? <span className="text-green-600">GRATIS</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg border-t border-gray-300 pt-3">
                  <span className="font-black uppercase">Total</span>
                  <span className="font-black">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
