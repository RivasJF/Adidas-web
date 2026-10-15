import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { productService } from '../service/productService';
import type { Product, ProductCategory, ProductTarget } from '../shared/types/product.types';

const DEFAULT_FILTERS = {
  target: 'Todos' as ProductTarget | 'Todos',
  size: 'Todos' as number | string | 'Todos',
  minPrice: 0,
  maxPrice: 300,
  sortBy: 'featured' as 'featured' | 'price-asc' | 'price-desc' | 'rating',
};

const VALID_CATEGORIES: ProductCategory[] = ['Fútbol', 'Tenis', 'Basquetball'];

interface HomePageProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ search, onSearchChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // La categoría se deriva de la URL (?category=Fútbol) para mantenerla sincronizada
  const categoryParam = searchParams.get('category');
  const category: ProductCategory | 'Todos' =
    categoryParam && VALID_CATEGORIES.includes(categoryParam as ProductCategory)
      ? (categoryParam as ProductCategory)
      : 'Todos';

  const filteredProducts = useMemo(
    () => productService.filterProducts({ ...filters, category, search }),
    [filters, category, search]
  );

  const updateFilter = useCallback(
    <K extends keyof typeof DEFAULT_FILTERS>(key: K, value: (typeof DEFAULT_FILTERS)[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleCategoryChange = useCallback(
    (cat: ProductCategory | 'Todos') => {
      if (cat === 'Todos') {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('category');
          return next;
        });
      } else {
        setSearchParams({ category: cat });
      }
    },
    [setSearchParams]
  );

  const handleCategoryFromBanner = useCallback((cat: ProductCategory | 'Todos') => {
    handleCategoryChange(cat);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }, [handleCategoryChange]);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onSearchChange('');
    setSearchParams({});
  }, [onSearchChange, setSearchParams]);

  return (
    <main>
      <HeroBanner onCategoryClick={handleCategoryFromBanner} />

      <section id="catalogo">
        <ProductFilters
          search={search}
          onSearchChange={onSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          target={filters.target}
          onTargetChange={(v) => updateFilter('target', v)}
          size={filters.size}
          onSizeChange={(v) => updateFilter('size', v)}
          minPrice={filters.minPrice}
          onMinPriceChange={(v) => updateFilter('minPrice', v)}
          maxPrice={filters.maxPrice}
          onMaxPriceChange={(v) => updateFilter('maxPrice', v)}
          sortBy={filters.sortBy}
          onSortByChange={(v) => updateFilter('sortBy', v)}
          onResetFilters={handleResetFilters}
          resultsCount={filteredProducts.length}
        />
      </section>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
              Catálogo completo
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              {category === 'Todos' ? 'Todos los Productos' : category}
            </h2>
          </div>
          <div className="hidden md:block text-right text-sm text-gray-500">
            Mostrando{' '}
            <strong className="text-black">{filteredProducts.length}</strong>{' '}
            de <strong className="text-black">{productService.getAll().length}</strong> productos
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5 bg-gray-50 border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase text-black mb-2">
                Sin resultados
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                No encontramos productos que coincidan con tus filtros. Intenta
                ampliar el rango de precios o limpiar la búsqueda.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="bg-black text-white px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setModalProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-yellow-400 font-black text-2xl mb-1">Envío Express</p>
            <p className="text-sm text-gray-400">Recibe tu pedido en 3-5 días hábiles</p>
          </div>
          <div>
            <p className="text-yellow-400 font-black text-2xl mb-1">30 Días</p>
            <p className="text-sm text-gray-400">Devoluciones y cambios sin costo</p>
          </div>
          <div>
            <p className="text-yellow-400 font-black text-2xl mb-1">Pago Seguro</p>
            <p className="text-sm text-gray-400">Tarjeta, transferencia o contraentrega</p>
          </div>
        </div>
      </section>

      <ProductModal
        key={modalProduct?.id ?? 'modal-closed'}
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </main>
  );
};
