import React from 'react';
import { Star, Sparkles, TrendingUp, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../shared/types/product.types';
import { useCart } from '../shared/context/cart.context';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: number | string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddDefaultSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    if (defaultSize) {
      if (onAddToCart) {
        onAddToCart(product, defaultSize);
      } else {
        addToCart(product, defaultSize, 1);
      }
    }
  };

  return (
    <article className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-300 flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Nuevo
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            Más Vendido
          </span>
        )}
        {discount > 0 && (
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
            -{discount}%
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="space-y-1.5">
          {/* Category & Target */}
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span>{product.category} • {product.target}</span>
          </div>

          {/* Name */}
          <h3 className="font-black text-base sm:text-lg uppercase tracking-tight text-black line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-black text-lg sm:text-xl text-black">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through font-medium">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Sizes Preview */}
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">
          Tallas: {product.sizes.slice(0, 4).join(', ')}
          {product.sizes.length > 4 && ` +${product.sizes.length - 4} más`}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 border border-gray-300 text-black text-xs sm:text-sm font-bold py-2.5 px-4 hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Vista Rápida
            </button>
          )}
          <button
            onClick={handleAddDefaultSize}
            className="flex-1 bg-black text-white text-xs sm:text-sm font-black py-2.5 px-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide"
          >
            <ShoppingCart className="w-4 h-4" />
            Añadir al Carrito
          </button>
        </div>
      </div>
    </article>
  );
};
