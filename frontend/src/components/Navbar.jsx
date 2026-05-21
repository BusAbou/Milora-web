import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#fff',
      borderBottom: scrolled ? '1px solid #e5e5e5' : '1px solid transparent',
      transition: 'border-color 0.3s',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left links */}
        <div style={{ display: 'flex', gap: 28, flex: 1 }}>
          {[['Accueil', '/'], ['Bodysuit MILORA', '/produit'], ['Contact', '/contact'], ['Suivre ma commande', '/suivi'], ['Avis', '/avis']].map(([label, path]) => (
            <Link key={path} to={path} style={{ fontSize: 13, letterSpacing: '0.5px', color: '#333', whiteSpace: 'nowrap' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Logo center */}
        <Link to="/" style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4, color: '#0a0a0a', flex: 1, textAlign: 'center' }}>
          MILORA
        </Link>

        {/* Right icons */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/produit')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>🔍</button>
          <button onClick={() => navigate('/panier')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', position: 'relative' }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: '#0a0a0a', color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
