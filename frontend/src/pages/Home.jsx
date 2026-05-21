import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';
import ReviewsSection from '../components/ReviewsSection';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const reassurance = [
  { icon: '🔄', title: 'Satisfaite ou Remboursée', desc: "30 jours pour changer d'avis" },
  { icon: '🔒', title: 'Paiement sécurisé', desc: 'Cryptage SSL 256 bits' },
  { icon: '📞', title: 'Support 7/7', desc: 'De 9h à 20h tous les jours' },
  { icon: '🚚', title: 'Livraison rapide', desc: 'Expédition sous 24–48h' },
];

const brands = ['Etam', 'SKIMS', 'Wolford', 'Etam', 'SKIMS', 'Wolford', 'Etam', 'SKIMS', 'Wolford'];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    await addToCart(1, 'M', 1);
    navigate('/panier');
  };

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
        <img src="/images/hero.jpeg" alt="Bodysuit MILORA collection"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}>
          <p style={{ fontSize: 12, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 20 }}>Collection 2026</p>
          <h1 style={{ fontSize: 'clamp(42px, 8vw, 90px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Sublimez votre silhouette
          </h1>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', marginBottom: 44, fontWeight: 300 }}>Et vos formes</p>
          <button className="btn-black" onClick={() => navigate('/produit')}
            style={{ background: '#fff', color: '#0a0a0a', padding: '16px 44px', fontSize: 13, letterSpacing: 2 }}>
            Bodysuit MILORA
          </button>
        </div>
      </section>

      {/* TEXTE PRODUIT */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 className="section-title">Bien plus qu'un body gainant</h2>
          <p style={{ fontSize: 16, lineHeight: 2, color: '#444' }}>
            Grâce à sa matière technique et sa <strong>compression douce ciblée</strong>, le body MILORA affine la silhouette,{' '}
            <strong>lisse le ventre</strong> et épouse vos <strong>formes naturellement</strong>.
          </p>
        </div>
      </section>

      {/* CARTE PRODUIT */}
      <section style={{ padding: '0 24px 80px', background: '#fafafa' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <ProductCard product={{ id: 1, name: 'Bodysuit MILORA' }} />
        </div>
      </section>

      {/* CONCEPTION INNOVANTE */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
            <img src="/images/conception.jpeg" alt="Conception innovante MILORA"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
          <div>
            <h2 className="section-title">Une conception innovante</h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 24 }}>
              MILORA a été imaginé à partir des besoins concrets des femmes, pour offrir un équilibre parfait entre maintien, confort et élégance.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['Silhouette naturellement affinée', 'Confort toute la journée', 'Invisible sous vos vêtements'].map(b => (
                <li key={b} style={{ fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>✔</span> {b}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 10 }}><strong>Découvrez MILORA</strong>, le compagnon discret de votre quotidien.</p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 10 }}><strong>Alliant confort, discrétion</strong> et efficacité pour chaque occasion.</p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}><strong>Adopté par de nombreuses femmes</strong> qui ne peuvent plus s'en passer.</p>
            <button className="btn-black" onClick={() => navigate('/produit')} style={{ marginTop: 28 }}>Découvrir le produit</button>
          </div>
        </div>
      </section>

      {/* AVANT / APRÈS */}
      <section style={{ padding: '80px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase', marginBottom: 12 }}>Résultats visibles</p>
            <h2 className="section-title">La différence MILORA,<br />visible dès le premier port</h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 24 }}>
              Notre technologie de compression douce redessine votre silhouette instantanément, sans sacrifier votre confort.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {["Résultat immédiat dès l'enfilage", 'Ventre affiné et maintenu', 'Dos gainé et posture améliorée'].map(b => (
                <li key={b} style={{ fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#e63946', fontWeight: 700 }}>✔</span> {b}
                </li>
              ))}
            </ul>
            <button className="btn-black" onClick={handleAddToCart}>Essayer MILORA — €14,99</button>
          </div>
          <div style={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <img src="/images/avant-apres.jpeg" alt="Avant Après Bodysuit MILORA" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* BANDEAU DÉFILANT */}
      <div style={{ overflow: 'hidden', background: '#0a0a0a', padding: '18px 0' }}>
        <div className="banner-track">
          {brands.concat(brands).map((b, i) => (
            <span key={i} style={{ color: '#fff', fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', padding: '0 40px' }}>{b} ·</span>
          ))}
        </div>
      </div>

      {/* RÉASSURANCE */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {reassurance.map(r => (
            <div key={r.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNIÈRE NOIRE avec image de fond */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/hero.jpeg" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.2)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: '#666', textTransform: 'uppercase', marginBottom: 16 }}>New Collection</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 300, color: '#fff', letterSpacing: 2 }}>Bodysuit Collection</h2>
          <p style={{ fontSize: 16, color: '#aaa', marginTop: 12, letterSpacing: 1 }}>What's New</p>
        </div>
      </section>

      <ReviewsSection />
      <FAQ />
      <Footer />
    </div>
  );
}
