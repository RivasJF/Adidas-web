import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, Package } from 'lucide-react';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { useCart } from '../shared/context/cart.context';
import { useOrder } from '../shared/context/order.context';
import type { CustomerData } from '../shared/types/order.types';

const initialForm: CustomerData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  department: '',
  postalCode: '',
  notes: '',
};

type Errors = Partial<Record<keyof CustomerData, string>>;

const validate = (form: CustomerData): Errors => {
  const errors: Errors = {};

  if (!form.firstName.trim()) errors.firstName = 'Ingresa tu nombre';
  if (!form.lastName.trim()) errors.lastName = 'Ingresa tus apellidos';
  if (!form.email.trim()) {
    errors.email = 'Ingresa tu correo electrónico';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'El correo no es válido';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Ingresa tu teléfono';
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
    errors.phone = 'Teléfono no válido';
  }
  if (!form.address.trim()) errors.address = 'Ingresa tu dirección';
  if (!form.city.trim()) errors.city = 'Ingresa tu ciudad';
  if (!form.department.trim()) errors.department = 'Ingresa tu departamento';
  if (!form.postalCode.trim()) errors.postalCode = 'Ingresa el código postal';

  return errors;
};

export const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, totalItems } = useCart();
  const { customerData, saveCustomerData } = useOrder();

  const [form, setForm] = useState<CustomerData>(customerData ?? initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  // Redirigir al catálogo si el carrito está vacío
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof CustomerData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched) {
      setErrors(validate({ ...form, [field]: value }));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Enfocar el primer campo con error
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    saveCustomerData(form);
    navigate('/checkout/pago');
  };

  const fieldClass = (field: keyof CustomerData) =>
    `w-full px-4 py-3 border text-sm font-medium bg-white outline-none transition-all ${
      errors[field] && touched
        ? 'border-red-500 focus:border-red-500 bg-red-50'
        : 'border-gray-300 focus:border-black'
    }`;

  return (
    <main className="bg-gray-50 min-h-screen">
      <CheckoutStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
            Paso 1 de 3
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Datos Personales
          </h1>
          <p className="text-gray-600 mt-2">
            Completa tu información de contacto y dirección de entrega.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 sm:p-8 space-y-6" noValidate>
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={handleBlur}
                    className={fieldClass('firstName')}
                    placeholder="Lionel"
                  />
                  {touched && errors.firstName && (
                    <p className="text-xs text-red-600 font-semibold mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Apellidos
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={handleBlur}
                    className={fieldClass('lastName')}
                    placeholder="Messi"
                  />
                  {touched && errors.lastName && (
                    <p className="text-xs text-red-600 font-semibold mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={handleBlur}
                  className={fieldClass('email')}
                  placeholder="tucorreo@ejemplo.com"
                />
                {touched && errors.email && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="sm:max-w-sm">
                <label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={handleBlur}
                  className={fieldClass('phone')}
                  placeholder="+57 300 123 4567"
                />
                {touched && errors.phone && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="pt-2 border-t border-gray-100">
                <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-600 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  Dirección de Entrega
                </p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Dirección
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={handleBlur}
                      className={fieldClass('address')}
                      placeholder="Calle 123 #45-67"
                    />
                    {touched && errors.address && (
                      <p className="text-xs text-red-600 font-semibold mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apartment" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Apartamento, suite, piso (opcional)
                    </label>
                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      value={form.apartment}
                      onChange={(e) => handleChange('apartment', e.target.value)}
                      className={fieldClass('apartment')}
                      placeholder="Apto 502"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Ciudad
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onBlur={handleBlur}
                        className={fieldClass('city')}
                        placeholder="Medellín"
                      />
                      {touched && errors.city && (
                        <p className="text-xs text-red-600 font-semibold mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Departamento
                      </label>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        autoComplete="address-level1"
                        value={form.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        onBlur={handleBlur}
                        className={fieldClass('department')}
                        placeholder="Antioquia"
                      />
                      {touched && errors.department && (
                        <p className="text-xs text-red-600 font-semibold mt-1">{errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Código Postal
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        autoComplete="postal-code"
                        value={form.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        onBlur={handleBlur}
                        className={fieldClass('postalCode')}
                        placeholder="050001"
                      />
                      {touched && errors.postalCode && (
                        <p className="text-xs text-red-600 font-semibold mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Notas para la entrega (opcional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className={fieldClass('notes')}
                      placeholder="Referencias, horarios preferidos..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la Tienda
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer group"
                >
                  Continuar al Pago
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-32 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Package className="w-5 h-5" />
                <h2 className="font-black uppercase tracking-wider">
                  Resumen del Pedido
                </h2>
                <span className="ml-auto bg-black text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>

              <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-black line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-gray-500">Talla {item.size}</p>
                      <p className="text-xs font-bold text-black mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
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
