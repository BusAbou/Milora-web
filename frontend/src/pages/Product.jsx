import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const reassurance = [
  { icon: '🔄', title: 'Satisfaite ou Remboursée' },
  { icon: '🔒', title: 'Paiement sécurisé' },
  { icon: '📞', title: 'Support 7/7' },
  { icon: '🚚', title: 'Livraison rapide' },
];

// Toutes les photos disponibles
const gallery = [
  { src: '/images/produit.jpeg', alt: 'Bodysuit MILORA noir' },
  { src: '/images/hero.jpeg', alt: 'Collection MILORA' },
  { src: '/images/conception.jpeg', alt: 'MILORA lifestyle' },
  { src: '/images/avant-apres.jpeg', alt: 'Avant Après MILORA' },
];

export default function Product() {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!selectedSize) { setError('Veuillez sélectionner une taille.'); return; }
    setError('');
    await addToCart(1, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) { setError('Veuillez sélectionner une taille.'); return; }
    await addToCart(1, selectedSize, quantity);
    navigate('/panier');
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* ── GALERIE PHOTOS ── */}
          <div>
            {/* Photo principale */}
            <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '3/4', marginBottom: 12 }}>
              <img
                src={gallery[activePhoto].src}
                alt={gallery[activePhoto].alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'opacity 0.3s' }}
              />
            </div>
            {/* Miniatures */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {gallery.map((img, i) => (
                <div key={i} onClick={() => setActivePhoto(i)}
                  style={{
                    borderRadius: 4, overflow: 'hidden', aspectRatio: '1',
                    cursor: 'pointer', border: `2px solid ${activePhoto === i ? '#0a0a0a' : 'transparent'}`,
                    transition: 'border-color 0.2s',
                  }}>
                  <img src={img.src} alt={img.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── DÉTAILS PRODUIT ── */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <span className="badge-promo">SAVE 42%</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 400, marginBottom: 20 }}>Bodysuit MILORA</h1>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
              <span style={{ fontSize: 15, color: '#999', textDecoration: 'line-through' }}>€25,99</span>
              <span style={{ fontSize: 26, fontWeight: 600 }}>€14,99</span>
            </div>

            {/* Taille */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Taille</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    width: 48, height: 48,
                    border: `1px solid ${selectedSize === s ? '#0a0a0a' : '#ddd'}`,
                    background: selectedSize === s ? '#0a0a0a' : '#fff',
                    color: selectedSize === s ? '#fff' : '#333',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  }}>{s}</button>
                ))}
              </div>
              {error && <p style={{ color: '#e63946', fontSize: 13, marginTop: 8 }}>{error}</p>}
            </div>

            {/* Quantité */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Quantité</p>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', width: 120 }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: 40, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>−</button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 15 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: 40, height: 40, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              <button className="btn-black" onClick={handleAdd} style={{ padding: '16px', fontSize: 13, letterSpacing: 2 }}>
                {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
              </button>
              <button className="btn-outline" onClick={handleBuyNow} style={{ padding: '15px', fontSize: 13, letterSpacing: 2 }}>
                Acheter maintenant
              </button>
            </div>

            {/* Réassurance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 24, borderTop: '1px solid #e5e5e5' }}>
              {reassurance.map(r => (
                <div key={r.title} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#555' }}>
                  <span style={{ fontSize: 16 }}>{r.icon}</span> {r.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description complète */}
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 400, marginBottom: 20, paddingTop: 40, borderTop: '1px solid #e5e5e5' }}>Description</h3>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 20 }}>
            Grâce à sa matière technique et sa <strong>compression douce ciblée</strong>, le body MILORA affine la silhouette,{' '}
            <strong>lisse le ventre</strong> et épouse vos <strong>formes naturellement</strong>.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Silhouette naturellement affinée', 'Confort toute la journée', 'Invisible sous vos vêtements', 'Matière respirante et douce', 'Entretien facile en machine'].map(b => (
              <li key={b} style={{ fontSize: 14, display: 'flex', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>✔</span> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
