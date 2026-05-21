import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusLabels = {
  en_attente: { label: 'En attente', color: '#ff9800', step: 1 },
  payee: { label: 'Paiement confirmé', color: '#2196f3', step: 2 },
  en_preparation: { label: 'En préparation', color: '#9c27b0', step: 3 },
  expediee: { label: 'Expédiée', color: '#00bcd4', step: 4 },
  livree: { label: 'Livrée', color: '#4caf50', step: 5 },
};

export default function Tracking() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setOrder(null);
    try {
      const { data } = await axios.get(`${API}/api/orders/${form.orderNumber}?email=${form.email}`);
      setOrder(data);
    } catch {
      setError('Commande introuvable. Vérifiez le numéro et l\'email.');
    } finally { setLoading(false); }
  };

  const status = order ? statusLabels[order.status] || { label: order.status, color: '#888', step: 1 } : null;

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '64px 24px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 8 }}>Suivre ma commande</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 48 }}>Entrez votre numéro de commande et votre email</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            <input
              type="text" required placeholder="N° de commande (ex: MILORA-1234567890)"
              value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })}
              style={{ padding: '13px 14px', border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
            />
            <input
              type="email" required placeholder="Adresse email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ padding: '13px 14px', border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" className="btn-black" disabled={loading} style={{ padding: '15px', fontSize: 13, letterSpacing: 2 }}>
              {loading ? 'Recherche...' : 'Suivre'}
            </button>
          </form>

          {error && <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: 16, fontSize: 14, color: '#c00' }}>{error}</div>}

          {order && (
            <div style={{ border: '1px solid #e5e5e5', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>COMMANDE</p>
                  <p style={{ fontWeight: 600, fontSize: 16 }}>{order.order_number}</p>
                </div>
                <span style={{
                  background: status.color + '20', color: status.color,
                  padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                }}>{status.label}</span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, position: 'relative' }}>
                  <div style={{ height: '100%', background: '#0a0a0a', borderRadius: 2, width: `${(status.step / 5) * 100}%`, transition: 'width 0.5s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  {['Commande', 'Paiement', 'Préparation', 'Expédition', 'Livraison'].map((s, i) => (
                    <span key={s} style={{ fontSize: 10, color: i < status.step ? '#0a0a0a' : '#ccc' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 20 }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Date : {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                {order.shipping_address && <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Adresse : {order.shipping_address}</p>}
                <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Articles commandés :</p>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span>{item.name} — {item.size} × {item.quantity}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, marginTop: 12 }}>
                  <span>Total</span><span>€{Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
