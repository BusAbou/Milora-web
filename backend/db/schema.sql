-- MILORA Database Schema

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_sizes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  stock INTEGER DEFAULT 0
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'en_attente',
  stripe_session_id TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  size VARCHAR(10),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE newsletter (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Données de départ
INSERT INTO products (name, description, price, original_price, stock, image_url) VALUES (
  'Bodysuit MILORA',
  'Le body gainant MILORA allie compression douce ciblée, confort toute la journée et discrétion totale sous vos vêtements.',
  14.99,
  25.99,
  100,
  '/images/bodysuit.jpg'
);

INSERT INTO product_sizes (product_id, size, stock) VALUES
  (1, 'XS', 20),
  (1, 'S', 30),
  (1, 'M', 25),
  (1, 'L', 15),
  (1, 'XL', 10);

-- Avis clients
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  size VARCHAR(10),
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Avis de démonstration (pré-approuvés)
INSERT INTO reviews (name, rating, comment, size, photo_url, status) VALUES
  ('Aissatou S.', 5, 'Incroyable ! Je le porte tous les jours sous mes vêtements. Le ventre est vraiment lissé et le maintien est parfait. Je recommande à toutes mes amies !', 'M', '/images/avis1.jpeg', 'approuve'),
  ('Léa M.', 5, 'Ce body est une révélation. Il se porte aussi bien avec un jean qu''avec une jupe. Très confortable toute la journée, aucune marque visible.', 'S', '/images/avis2.jpeg', 'approuve'),
  ('Yasmine K.', 5, 'J''avais des doutes au début mais dès le premier essayage j''ai été conquise. La silhouette est immédiatement affinée. Taille parfaitement !', 'M', '/images/avis3.jpeg', 'approuve'),
  ('Camille R.', 5, 'Le body MILORA c''est mon secret beauté ! Invisible sous les vêtements, il gaine sans comprimer. Je l''ai commandé en double tellement j''en suis satisfaite.', 'S', '/images/avis4.jpeg', 'approuve'),
  ('Sofia T.', 5, 'Parfait pour tous les jours. La compression est douce, on ne se sent pas à l''étroit. Mon ventre est flat et ma silhouette est top. Merci MILORA !', 'XS', '/images/avis5.jpeg', 'approuve');
