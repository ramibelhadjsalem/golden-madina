-- SQL commands to update the artifacts table schema and insert sample data

-- 1. First, let's update the schema to remove the has_model field
ALTER TABLE artifacts
DROP COLUMN has_model;

-- 2. Insert sample artifacts
INSERT INTO artifacts (
  id,
  created_at,
  name,
  description,
  period,
  category,
  image_url,
  model_url,
  location,
  discovery_date,
  additional_images
) VALUES 
(
  gen_random_uuid(),
  NOW(),
  'Ancient Greek Amphora',
  'A well-preserved terracotta amphora used for storing wine and oil in ancient Greece. This artifact dates to approximately 450 BCE, originating from Athens during the height of Classical Greek civilization. Standing 45 centimeters tall, it exemplifies the elegant proportions and refined craftsmanship typical of the period.',
  '5th Century BCE',
  'Pottery',
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5jaWVudCUyMHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  'https://example.com/models/amphora.glb',
  'Athens, Greece',
  '1952-06-15',
  ARRAY['https://example.com/images/amphora_side.jpg', 'https://example.com/images/amphora_bottom.jpg']
),
(
  gen_random_uuid(),
  NOW(),
  'Medieval Illuminated Manuscript',
  'A handwritten book decorated with gold or silver, brilliant colors, elaborate designs, or miniature illustrations. This particular manuscript is from a 14th-century French monastery and contains religious texts with intricate illustrations of biblical scenes.',
  '14th Century',
  'Books',
  'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaWV2YWwlMjBtYW51c2NyaXB0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  NULL,
  'Paris, France',
  '1889-11-03',
  ARRAY['https://example.com/images/manuscript_page1.jpg', 'https://example.com/images/manuscript_page2.jpg']
),
(
  gen_random_uuid(),
  NOW(),
  'Roman Marble Bust',
  'A finely carved marble bust of a Roman patrician from the late Republic period. The realistic portrayal shows the subject''s age and character, typical of Roman portraiture of the time. The bust stands 45 cm tall and is remarkably well-preserved.',
  '1st Century BCE',
  'Sculpture',
  'https://images.unsplash.com/photo-1566936440121-d17fc7a705cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cm9tYW4lMjBidXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  'https://example.com/models/roman_bust.glb',
  'Rome, Italy',
  '1901-08-22',
  ARRAY['https://example.com/images/bust_profile.jpg', 'https://example.com/images/bust_back.jpg']
),
(
  gen_random_uuid(),
  NOW(),
  'Viking Gold Bracelet',
  'An intricately designed gold bracelet from the Viking Age, featuring twisted gold wires and animal motifs. This piece of jewelry was likely worn by a high-status individual and demonstrates the sophisticated metalworking techniques of Viking craftsmen.',
  '9th Century CE',
  'Jewelry',
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29sZCUyMGJyYWNlbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  NULL,
  'Oslo, Norway',
  '1956-04-10',
  NULL
),
(
  gen_random_uuid(),
  NOW(),
  'Ancient Egyptian Canopic Jar',
  'A ceremonial jar used in ancient Egyptian burial rituals for storing mummified organs. This particular jar, made of alabaster, features a lid carved in the form of Duamutef, one of the four sons of Horus, who protected the stomach of the deceased.',
  '1300 BCE',
  'Ceremonial',
  'https://images.unsplash.com/photo-1608372769516-53e4d84cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWd5cHRpYW4lMjBhcnRpZmFjdHxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60',
  'https://example.com/models/canopic_jar.glb',
  'Luxor, Egypt',
  '1922-11-26',
  ARRAY['https://example.com/images/jar_open.jpg', 'https://example.com/images/jar_hieroglyphs.jpg']
);
