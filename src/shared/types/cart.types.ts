import type { Product } from './product.types';

export interface CartItem {
  id: string; // generated as `${productId}-${size}`
  product: Product;
  size: number | string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: number | string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
