import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { HomePage } from '../pages/HomePage';
import { PersonalInfoPage } from '../pages/PersonalInfoPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppRouter = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <ScrollToTop />
      <Navbar onSearchChange={setSearchTerm} searchValue={searchTerm} />

      <div className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={<HomePage search={searchTerm} onSearchChange={setSearchTerm} />}
          />
          <Route path="/checkout/datos" element={<PersonalInfoPage />} />
          <Route path="/checkout/pago" element={<PaymentPage />} />
          <Route path="/checkout/confirmacion" element={<OrderConfirmationPage />} />
          <Route path="*" element={<HomePage search={searchTerm} onSearchChange={setSearchTerm} />} />
        </Routes>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
};
