import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const staticReviews = [
  { id: 1, name: 'Aissatou S.', rating: 5, comment: "Incroyable ! Je le porte tous les jours sous mes vêtements. Le ventre est vraiment lissé et le maintien est parfait. Je recommande à toutes mes amies !", size: 'M', photo_url: '/images/avis1.jpeg' },
  { id: 2, name: 'Léa M.', rating: 5, comment: "Ce body est une révélation. Il se porte aussi bien avec un jean qu'avec une jupe. Très confortable toute la journée, aucune marque visible.", size: 'S', photo_url: '/images/avis2.jpeg' },
  { id: 3, name: 'Yasmine K.', rating: 5, comment: "J'avais des doutes au début mais dès le premier essayage j'ai été conquise. La silhouette est immédiatement affinée. Taille parfaitement !", size: 'M', photo_url: '/images/avis3.jpeg' },
  { id: 4, name: 'Camille R.', rating: 5, comment: "Le body MILORA c'est mon secret beauté ! Invisible sous les vêtements, il gaine sans comprimer. Je l'ai commandé en double !", size: 'S', photo_url: '/images/avis4.jpeg' },
  { id: 5, name: 'Sofia T.', rating: 5, comment: "Parfait pour tous les jours. La compression est douce, on ne se sent pas à l'étroit. Mon ventre est flat et ma silhouette est top !", size: 'XS', photo_url: '/images/avis5.jpeg' },
];

function Stars({ rating, onSelect }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          onClick={() => onSelect && onSelect(i)}
          onMouseEnter={() => onSelect && setHover(i)}
          onMouseLeave={() => onSelect && setHover(0)}
          style={{
            fontSize: onSelect ? 28 : 15,
            color: i <= (hover || rating) ? '#e8b84b' : '#ddd',
            cursor: onSelect ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
        >★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(staticReviews);
  const [lightbox, setLightbox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '', size: '', photo: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/reviews`)
      .then(({ data }) => { if (data.length > 0) setReviews(data); })
      .catch(() => {});
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('rating', form.rating);
      fd.append('comment', form.comment);
      fd.append('size', form.size);
      if (form.photo) fd.append('photo', form.photo);
      await axios.post(`${API}/api/reviews`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch {
      alert('Erreur lors de la soumission. Réessayez.');
    } finally { setLoading(false); }
  };

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80 }}>

        {/* Hero section */}
        <div style={{ background: '#fafafa', padding: '60px 24px', textAlign: 'center', borderBottom: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase', marginBottom: 12 }}>Avis vérifiés</p>
          <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 16 }}>Elles ont adopté MILORA</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <Stars rating={5} />
            <span style={{ fontSize: 20, fontWeight: 600 }}>{avg}</span>
            <span style={{ fontSize: 14, color: '#888' }}>sur 5 · {reviews.length} avis</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-black"
            style={{ padding: '13px 32px', fontSize: 13, letterSpacing: 1.5 }}
          >
            {showForm ? 'Annuler' : '✍️ Laisser mon avis'}
          </button>
        </div>

        {/* Formulaire avis */}
        {showForm && (
          <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '40px 24px' }}>
            <div style={{ maxWidth: 580, margin: '0 auto' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontWeight: 400, fontSize: 20, marginBottom: 8 }}>Merci pour votre avis !</h3>
                  <p style={{ color: '#888', fontSize: 14 }}>Il sera publié après validation par notre équipe sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, fontWeight: 400, marginBottom: 24 }}>Partagez votre expérience</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 6 }}>Prénom *</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Votre prénom"
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 6 }}>Taille portée</label>
                      <select value={form.size} onChange={e => setForm({...form, size: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: 14, outline: 'none', background: '#fff' }}>
                        <option value="">-- Taille --</option>
                        {['XS','S','M','L','XL'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 8 }}>Note *</label>
                    <Stars rating={form.rating} onSelect={r => setForm({...form, rating: r})} />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 6 }}>Votre avis *</label>
                    <textarea required rows={4} value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}
                      placeholder="Partagez votre expérience avec le Bodysuit MILORA..."
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: 14, resize: 'vertical', outline: 'none' }} />
                  </div>

                  {/* Upload photo */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 8 }}>Ajouter une photo (optionnel)</label>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                      border: '1px dashed #ccc', cursor: 'pointer', fontSize: 13, color: '#666',
                    }}>
                      <span style={{ fontSize: 20 }}>📷</span>
                      {form.photo ? form.photo.name : 'Cliquez pour ajouter une photo'}
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                    </label>
                    {preview && (
                      <img src={preview} alt="preview" style={{ marginTop: 10, width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                  </div>

                  <button type="submit" className="btn-black" disabled={loading} style={{ width: '100%', padding: '15px', fontSize: 13, letterSpacing: 2 }}>
                    {loading ? 'Envoi en cours...' : 'Soumettre mon avis'}
                  </button>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 10, textAlign: 'center' }}>
                    Votre avis sera publié après validation sous 24h.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Grille avis avec photos */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setLightbox(review)}>
                {review.photo_url && (
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={review.photo_url.startsWith('/images') ? review.photo_url : `${API}${review.photo_url}`}
                      alt={`Avis ${review.name}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                )}
                <div style={{ padding: '14px 16px' }}>
                  <Stars rating={review.rating} />
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: '#444', margin: '8px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{review.comment}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{review.name}</span>
                    {review.size && <span style={{ fontSize: 11, color: '#aaa', background: '#f5f5f5', padding: '2px 8px' }}>Taille {review.size}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: '#fff', borderRadius: 4, overflow: 'hidden', maxWidth: 800, width: '100%',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}>
              {lightbox.photo_url && (
                <img
                  src={lightbox.photo_url.startsWith('/images') ? lightbox.photo_url : `${API}${lightbox.photo_url}`}
                  alt={lightbox.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', maxHeight: 500 }}
                />
              )}
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stars rating={lightbox.rating} />
                <p style={{ fontSize: 16, lineHeight: 1.8, color: '#333', margin: '16px 0', fontStyle: 'italic' }}>
                  "{lightbox.comment}"
                </p>
                <p style={{ fontWeight: 500, fontSize: 14 }}>{lightbox.name}</p>
                {lightbox.size && <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Taille portée : {lightbox.size}</p>}
                <button onClick={() => setLightbox(null)} style={{
                  marginTop: 24, background: 'none', border: '1px solid #ddd', padding: '10px',
                  cursor: 'pointer', fontSize: 13, color: '#666',
                }}>Fermer</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
