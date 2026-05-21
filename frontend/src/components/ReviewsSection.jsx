import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Avis statiques de démonstration (avec les vraies photos)
const staticReviews = [
  { id: 1, name: 'Aissatou S.', rating: 5, comment: "Incroyable ! Je le porte tous les jours sous mes vêtements. Le ventre est vraiment lissé et le maintien est parfait. Je recommande à toutes mes amies !", size: 'M', photo_url: '/images/avis1.jpeg' },
  { id: 2, name: 'Léa M.', rating: 5, comment: "Ce body est une révélation. Il se porte aussi bien avec un jean qu'avec une jupe. Très confortable toute la journée, aucune marque visible.", size: 'S', photo_url: '/images/avis2.jpeg' },
  { id: 3, name: 'Yasmine K.', rating: 5, comment: "J'avais des doutes au début mais dès le premier essayage j'ai été conquise. La silhouette est immédiatement affinée. Taille parfaitement !", size: 'M', photo_url: '/images/avis3.jpeg' },
  { id: 4, name: 'Camille R.', rating: 5, comment: "Le body MILORA c'est mon secret beauté ! Invisible sous les vêtements, il gaine sans comprimer. Je l'ai commandé en double !", size: 'S', photo_url: '/images/avis4.jpeg' },
  { id: 5, name: 'Sofia T.', rating: 5, comment: "Parfait pour tous les jours. La compression est douce, on ne se sent pas à l'étroit. Mon ventre est flat et ma silhouette est top !", size: 'XS', photo_url: '/images/avis5.jpeg' },
];

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#e8b84b' : '#ddd', fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(staticReviews);
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/reviews`)
      .then(({ data }) => { if (data.length > 0) setReviews(data); })
      .catch(() => {});
  }, []);

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase', marginBottom: 10 }}>Témoignages</p>
            <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 10 }}>Elles ont adopté MILORA</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#e8b84b', fontSize: 18 }}>★</span>)}
              </div>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{avg} / 5</span>
              <span style={{ fontSize: 13, color: '#888' }}>({reviews.length} avis vérifiés)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/avis')}
            style={{ fontSize: 13, color: '#0a0a0a', background: 'none', border: '1px solid #0a0a0a', padding: '10px 24px', cursor: 'pointer', letterSpacing: 1 }}
          >
            Voir tous les avis
          </button>
        </div>

        {/* Grille photos UGC */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              onClick={() => setActive(active === review.id ? null : review.id)}
              style={{ position: 'relative', cursor: 'pointer', borderRadius: 4, overflow: 'hidden', aspectRatio: '3/4' }}
            >
              <img
                src={review.photo_url?.startsWith('/images') ? review.photo_url : `${API}${review.photo_url}`}
                alt={`Avis ${review.name}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Overlay au hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: active === review.id ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0)',
                transition: 'background 0.3s',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16,
              }}
                onMouseEnter={e => { if (active !== review.id) e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; }}
                onMouseLeave={e => { if (active !== review.id) e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
              >
                <Stars rating={review.rating} />
                <p style={{ color: '#fff', fontSize: 12, lineHeight: 1.6, margin: '6px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{review.comment}"
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
                  {review.name} · Taille {review.size}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA laisser un avis */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => navigate('/avis')}
            className="btn-black"
            style={{ padding: '14px 36px', fontSize: 13, letterSpacing: 2 }}
          >
            Partager mon expérience
          </button>
        </div>
      </div>
    </section>
  );
}
