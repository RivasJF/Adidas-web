import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, PackageX } from 'lucide-react';
import { useCart } from '../shared/context/cart.context';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    totalItems,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout/datos');
  };

  const freeShippingRemaining = Math.max(0, 100 - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="relative w-full sm:max-w-md h-full bg-white flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-black text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-black uppercase tracking-wider text-lg">
              Tu Carrito
            </h2>
            <span className="bg-white text-black text-xs font-black px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && freeShippingRemaining > 0 && (
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
            <p className="text-xs text-yellow-800 font-medium mb-1.5">
              Te faltan <strong>${freeShippingRemaining.toFixed(2)}</strong> para envío gratis
            </p>
            <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {items.length > 0 && shipping === 0 && (
          <div className="px-6 py-3 bg-green-50 border-b border-green-200 text-xs font-bold text-green-700 uppercase tracking-wider text-center">
            🎉 ¡Tu pedido tiene envío gratis!
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <PackageX className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-sm text-gray-500">
                  Explora nuestro catálogo y encuentra tu par ideal.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="bg-black text-white px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 flex gap-4">
                  {/* Product image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-black line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                        aria-label={`Eliminar ${item.product.name}`}
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.product.category} • Talla <strong className="text-black">{item.size}</strong>
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity control */}
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-black text-sm text-black">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="font-bold">
                {shipping === 0 ? (
                  <span className="text-green-600">GRATIS</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-lg border-t border-gray-300 pt-3">
              <span className="font-black uppercase tracking-wider">Total</span>
              <span className="font-black">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white font-black uppercase tracking-wider py-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              Finalizar Compra
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-red-600 text-xs font-medium underline underline-offset-2 transition-colors cursor-pointer py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
