export type ProductCategory = 'Fútbol' | 'Tenis' | 'Basquetball';

export type ProductTarget = 'Adulto' | 'Niños' | 'Unisex';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  target: ProductTarget;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  colors: string[];
  sizes: (number | string)[];
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
}

export interface ProductFiltersState {
  search: string;
  category: ProductCategory | 'Todos';
  target: ProductTarget | 'Todos';
  size: number | string | 'Todos';
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}
