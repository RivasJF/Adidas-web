import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './shared/context/CartContext';
import { OrderProvider } from './shared/context/OrderContext';
import { InvoiceProvider } from './shared/context/InvoiceContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <InvoiceProvider>
            <AppRouter />
          </InvoiceProvider>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
