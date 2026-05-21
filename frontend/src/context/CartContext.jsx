import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getSessionId() {
  let id = localStorage.getItem('milora_session');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 12);
    localStorage.setItem('milora_session', id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = getSessionId();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API}/api/cart/${sessionId}`);
      setCartItems(data);
    } catch {}
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (product_id, size, quantity = 1) => {
    await axios.post(`${API}/api/cart`, { session_id: sessionId, product_id, size, quantity });
    fetchCart();
  };

  const updateItem = async (itemId, quantity) => {
    await axios.put(`${API}/api/cart/${itemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API}/api/cart/${itemId}`);
    fetchCart();
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, updateItem, removeItem, sessionId, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
