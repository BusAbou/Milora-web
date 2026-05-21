import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get('session_id');

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '80px 24px', maxWidth: 500 }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>Merci pour votre commande !</h1>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>
            Votre paiement a bien été confirmé. Vous recevrez un email de confirmation avec votre numéro de commande.
          </p>
          {sessionId && (
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32, fontFamily: 'monospace' }}>
              Réf. Stripe : {sessionId.slice(0, 30)}...
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-black" onClick={() => navigate('/suivi')}>Suivre ma commande</button>
            <button className="btn-outline" onClick={() => navigate('/')}>Retour à l'accueil</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function Failure() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '80px 24px', maxWidth: 500 }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>😞</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>Paiement annulé</h1>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 32 }}>
            Votre paiement n'a pas abouti. Votre panier est toujours intact — vous pouvez réessayer.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-black" onClick={() => navigate('/panier')}>Retour au panier</button>
            <button className="btn-outline" onClick={() => navigate('/contact')}>Contacter le support</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Success;
