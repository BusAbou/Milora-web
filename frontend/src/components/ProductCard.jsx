import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = async (e) => {
    e.stopPropagation();
    await addToCart(product.id || 1, 'M', 1);
    navigate('/panier');
  };

  return (
    <div
      onClick={() => navigate('/produit')}
      style={{
        border: '1px solid #e5e5e5', cursor: 'pointer',
        transition: 'box-shadow 0.2s', background: '#fff',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Image produit */}
      <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
        <img
          src="/images/produit.jpeg"
          alt="Bodysuit MILORA"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{product?.name || 'Bodysuit MILORA'}</span>
          <span className="badge-promo">SAVE 42%</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: '#999', textDecoration: 'line-through' }}>€25,99</span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>€14,99</span>
        </div>
        <button className="btn-black" onClick={handleAdd} style={{ width: '100%', padding: '13px' }}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
