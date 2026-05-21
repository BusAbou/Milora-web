import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Cart() {
  const { cartItems, cartTotal, updateItem, removeItem, sessionId } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post(`${API}/api/stripe/checkout`, {
        cartItems,
        sessionId,
      });
      window.location.href = data.url;
    } catch (err) {
      alert('Erreur lors du paiement. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80, minHeight: '80vh' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 40 }}>Votre panier</h1>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>Votre panier est vide</p>
              <button className="btn-black" onClick={() => navigate('/produit')}>Continuer les achats</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48 }}>

              {/* Cart items */}
              <div>
                {cartItems.map(item => (
                  <div key={item.id} style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr auto',
                    gap: 16, padding: '20px 0', borderBottom: '1px solid #e5e5e5', alignItems: 'center',
                  }}>
                    <div style={{ background: '#f5f5f5', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🖤</div>
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Taille : {item.size}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #ddd', width: 100 }}>
                        <button onClick={() => updateItem(item.id, item.quantity - 1)}
                          style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)}
                          style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 500, marginBottom: 8 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.id)}
                        style={{ fontSize: 12, color: '#999', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div>
                <div style={{ border: '1px solid #e5e5e5', padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>Récapitulatif</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span>Sous-total</span><span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span>Livraison</span><span style={{ color: '#4caf50' }}>Gratuite</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 16, marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600 }}>
                    <span>Total</span><span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn-black" onClick={handleCheckout} style={{ width: '100%', marginTop: 20, padding: '16px', fontSize: 13 }}>
                    Procéder au paiement
                  </button>
                  {/* Payment icons */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                    {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map(p => (
                      <span key={p} style={{ fontSize: 10, background: '#f5f5f5', padding: '3px 8px', borderRadius: 3, color: '#888' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upsell */}
          {cartItems.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <h3 style={{ fontSize: 18, fontWeight: 400, marginBottom: 24 }}>Vous aimerez aussi</h3>
              <div style={{ maxWidth: 280 }}>
                <ProductCard product={{ id: 1, name: 'Bodysuit MILORA' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
