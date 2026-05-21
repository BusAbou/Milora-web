import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/contact`, form);
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '64px 24px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 8 }}>Contact</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 48 }}>Notre équipe vous répond 7j/7 de 9h à 20h</p>

          {sent ? (
            <div style={{ background: '#f0faf0', border: '1px solid #c8e6c9', padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: 24, marginBottom: 12 }}>✅</p>
              <h3 style={{ fontWeight: 400, marginBottom: 8 }}>Message envoyé !</h3>
              <p style={{ fontSize: 14, color: '#555' }}>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'name', label: 'Nom', type: 'text', placeholder: 'Votre nom' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
                { name: 'subject', label: 'Sujet', type: 'text', placeholder: 'Sujet de votre message' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type} name={field.name} required
                    placeholder={field.placeholder}
                    value={form[field.name]} onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 6 }}>Message</label>
                <textarea
                  name="message" required rows={6}
                  placeholder="Votre message..."
                  value={form.message} onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', fontSize: 14, resize: 'vertical', outline: 'none' }}
                />
              </div>
              {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
              <button type="submit" className="btn-black" style={{ padding: '15px', fontSize: 13, letterSpacing: 2 }}>
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
