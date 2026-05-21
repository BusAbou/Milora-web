import React, { useState } from 'react';

const faqs = [
  { q: 'Le body est-il confortable toute la journée ?', a: 'Oui, MILORA est conçu avec un tissu doux et respirant pour un confort optimal du matin au soir.' },
  { q: "Comment fonctionne l'offre 1 acheté = 1 offert ?", a: "Ajoutez un produit au panier, et le second est automatiquement inclus selon l'offre en cours." },
  { q: 'Que faire si mon produit est défectueux ?', a: 'Contactez-nous sous 48h avec une photo. Nous vous proposerons un remplacement ou un remboursement immédiat.' },
  { q: 'Comment faire un retour ?', a: 'Contactez notre service client. Nous vous accompagnerons dans la procédure simple et rapide.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: '80px 24px', background: '#fafafa' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 40, textAlign: 'center' }}>Vous demandez souvent</h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e5e5e5' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', textAlign: 'left', padding: '20px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 15, fontWeight: 400,
              }}
            >
              {faq.q}
              <span style={{ fontSize: 20, color: '#888', transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <p style={{ padding: '0 0 20px', fontSize: 14, color: '#555', lineHeight: 1.8 }}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
