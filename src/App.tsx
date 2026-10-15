import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './shared/context/CartContext';
import { OrderProvider } from './shared/context/OrderContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <AppRouter />
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
