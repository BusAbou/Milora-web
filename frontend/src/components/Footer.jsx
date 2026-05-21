import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/newsletter`, { email });
      setSent(true);
      setEmail('');
    } catch {}
  };

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', padding: '64px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 4, marginBottom: 12 }}>MILORA</div>
            <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.8 }}>Sublimez votre silhouette</p>
            <p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>Service client 7j/7 de 9h à 20h</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>
              Rejoignez la communauté et bénéficiez de <strong style={{ color: '#fff' }}>-10% sur votre prochaine commande</strong>
            </p>
            {sent ? (
              <p style={{ color: '#4caf50', fontSize: 14 }}>✓ Merci ! Votre code promo arrive par email.</p>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 0 }}>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  style={{
                    flex: 1, padding: '12px 16px', background: '#1a1a1a',
                    border: '1px solid #333', borderRight: 'none',
                    color: '#fff', fontSize: 13,
                  }}
                />
                <button type="submit" style={{
                  background: '#fff', color: '#0a0a0a',
                  border: 'none', padding: '12px 20px',
                  fontSize: 12, letterSpacing: 1, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  Je rejoins la communauté
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Payment icons */}
        <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#555' }}>© 2026, MILORA</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'CB'].map(p => (
              <span key={p} style={{
                fontSize: 11, background: '#1a1a1a', color: '#aaa',
                padding: '4px 10px', borderRadius: 4, border: '1px solid #333',
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
