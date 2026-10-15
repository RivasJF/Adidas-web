import productsData from './products.json';
import type { Product, ProductFiltersState } from '../shared/types/product.types';

export const productService = {
  getAll: (): Product[] => {
    return productsData as Product[];
  },

  getById: (id: string): Product | undefined => {
    return (productsData as Product[]).find((p) => p.id === id);
  },

  getAllSizes: (): (number | string)[] => {
    const sizeSet = new Set<number | string>();
    (productsData as Product[]).forEach((p) => {
      p.sizes.forEach((s) => sizeSet.add(s));
    });
    return Array.from(sizeSet).sort((a, b) => Number(a) - Number(b));
  },

  filterProducts: (filters: ProductFiltersState): Product[] => {
    let result = productsData as Product[];

    // Búsqueda por texto (nombre, subtítulo o descripción)
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.subtitle.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.target.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (filters.category !== 'Todos') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filtro por público (Adulto, Niños, Unisex)
    if (filters.target !== 'Todos') {
      result = result.filter((p) => p.target === filters.target);
    }

    // Filtro por talla
    if (filters.size !== 'Todos') {
      result = result.filter((p) => p.sizes.includes(filters.size));
    }

    // Filtro por rango de precio
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Ordenamiento
    switch (filters.sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  },
};
