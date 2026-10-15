import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import type { ProductCategory, ProductTarget } from '../shared/types/product.types';
import { productService } from '../service/productService';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  category: ProductCategory | 'Todos';
  onCategoryChange: (category: ProductCategory | 'Todos') => void;
  target: ProductTarget | 'Todos';
  onTargetChange: (target: ProductTarget | 'Todos') => void;
  size: number | string | 'Todos';
  onSizeChange: (size: number | string | 'Todos') => void;
  minPrice: number;
  onMinPriceChange: (price: number) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSortByChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  onResetFilters: () => void;
  resultsCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  target,
  onTargetChange,
  size,
  onSizeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  resultsCount,
}) => {
  const allSizes = productService.getAllSizes();

  const activeFiltersCount = [
    search !== '',
    category !== 'Todos',
    target !== 'Todos',
    size !== 'Todos',
    minPrice > 0 || maxPrice < 300,
    sortBy !== 'featured',
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top bar: Search + Sort + Filters count */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o público (ej. Predator, Barricade, Harden...)"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 pl-11 pr-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3.5 p-1 hover:bg-gray-200 rounded-full"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Reset */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 px-3 py-2.5">
              <ArrowUpDown className="w-4 h-4 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortByChange(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')
                }
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Menor Precio</option>
                <option value="price-desc">Mayor Precio</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                Limpiar Filtros ({activeFiltersCount})
              </button>
            )}

            <div className="text-sm text-gray-600 ml-auto md:ml-0">
              <span className="font-bold text-black">{resultsCount}</span> productos encontrados
            </div>
          </div>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          
          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">
              Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Fútbol', 'Tenis', 'Basquetball'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide border transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {cat === 'Basquetball' ? 'Basketball' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Target (Público) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">
              Público
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Adulto', 'Niños', 'Unisex'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onTargetChange(t)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide border transition-colors cursor-pointer ${
                    target === t
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">
                Tallas Disponibles
              </label>
              {size !== 'Todos' && (
                <button
                  onClick={() => onSizeChange('Todos')}
                  className="text-xs underline hover:no-underline"
                >
                  Ver todas
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              <button
                onClick={() => onSizeChange('Todos')}
                className={`px-2.5 py-1 min-w-[2.25rem] text-xs font-bold border transition-colors ${
                  size === 'Todos'
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-gray-300 hover:border-black'
                }`}
              >
                Todo
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  className={`px-2.5 py-1 min-w-[2.25rem] text-xs font-bold border transition-colors ${
                    size === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 col-span-2 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">
              Rango de Precio
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">$</span>
                  <input
                    type="number"
                    min={0}
                    max={maxPrice}
                    step={5}
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(Number(e.target.value))}
                    className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-300 bg-white focus:outline-none focus:border-black"
                    placeholder="Mín"
                  />
                </div>
                <span className="text-gray-400">—</span>
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">$</span>
                  <input
                    type="number"
                    min={minPrice}
                    max={300}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                    className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-300 bg-white focus:outline-none focus:border-black"
                    placeholder="Máx"
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
