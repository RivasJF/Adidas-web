import React, { useEffect, useState } from 'react';
import { X, Star, Minus, Plus, ShoppingCart, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import type { Product } from '../shared/types/product.types';
import { useCart } from '../shared/context/cart.context';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${product.name}`}
    >
      <div
        className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white border border-gray-200 hover:bg-black hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-gray-100 aspect-square md:aspect-auto md:min-h-[500px] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
                  Nuevo
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 uppercase tracking-widest">
                  -{discount}%
                </span>
              )}
            </div>
            <button
              className="absolute bottom-4 right-4 p-3 bg-white/90 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Añadir a favoritos"
              title="Añadir a favoritos"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-2">
                {product.category} • {product.target}
              </p>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-600 mt-1">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.rating} de 5 — {product.reviewsCount} reseñas
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 border-t border-b border-gray-200 py-4">
              <span className="text-3xl font-black text-black">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through font-medium">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-black text-green-700 bg-green-50 px-2 py-1">
                  Ahorras ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Colores
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1.5 border border-gray-300 text-sm font-medium"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Selecciona tu talla
                </p>
                {sizeError && (
                  <span className="text-xs font-bold text-red-600">
                    Selecciona una talla
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                    }}
                    className={`min-w-[3rem] px-3 py-2.5 text-sm font-bold border transition-colors cursor-pointer ${
                      selectedSize === s
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white font-black uppercase tracking-wider py-3.5 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al Carrito
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 text-center">
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Envío gratis +$100</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">30 días devolución</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">100% original</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
