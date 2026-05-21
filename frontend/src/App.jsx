import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './index.css';

import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Reviews from './pages/Reviews';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produit" element={<Product />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/suivi" element={<Tracking />} />
          <Route path="/merci" element={<Success />} />
          <Route path="/echec" element={<Failure />} />
          <Route path="/avis" element={<Reviews />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
