-- Chatbot responses for Golden Madina
-- This SQL file contains 10 common chatbot responses with multiple patterns for each question
-- Each response is provided in English, French, and Arabic

-- Create the chatbot_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chatbot_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  intent TEXT NOT NULL,
  pattern TEXT[] NOT NULL,
  response_en TEXT NOT NULL,
  response_fr TEXT,
  response_ar TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- 1. Greeting
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'greeting',
  ARRAY['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'],
  'Hello! I''m the Golden Madina chatbot. How can I help you today?',
  'Bonjour ! Je suis le chatbot de Golden Madina. Comment puis-je vous aider aujourd''hui ?',
  'مرحبًا! أنا المساعد الآلي لشركة جولدن مدينة. كيف يمكنني مساعدتك اليوم؟',
  10,
  TRUE
);

-- 2. Company Information
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'company_info',
  ARRAY['what is golden madina', 'about golden madina', 'company information', 'tell me about', 'who are you', 'what do you do', 'about the company'],
  'Golden Madina is a Tunisian creative cultural industry specializing in material and immaterial heritage valorization. We preserve cultural legacy through artifacts, stories, and services.',
  'Golden Madina est une industrie culturelle créative tunisienne spécialisée dans la valorisation du patrimoine matériel et immatériel. Nous préservons l''héritage culturel à travers des artefacts, des histoires et des services.',
  'جولدن مدينة هي صناعة ثقافية إبداعية تونسية متخصصة في تثمين التراث المادي وغير المادي. نحن نحافظ على التراث الثقافي من خلال القطع الأثرية والقصص والخدمات.',
  9,
  TRUE
);

-- 3. Services
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'services',
  ARRAY['services', 'what services', 'offerings', 'what do you offer', 'guided tours', 'exhibitions'],
  'We offer guided tours, conservation consultations, educational programs, and cultural exhibitions. Visit our Services page for details.',
  'Nous proposons des visites guidées, des consultations de conservation, des programmes éducatifs et des expositions culturelles. Visitez notre page Services pour plus de détails.',
  'نقدم جولات مصحوبة بمرشدين، واستشارات الحفظ، وبرامج تعليمية، ومعارض ثقافية. يرجى زيارة صفحة الخدمات للحصول على التفاصيل.',
  8,
  TRUE
);

-- 4. Artifacts
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'artifacts',
  ARRAY['artifacts', 'collections', 'what artifacts', 'historical items', 'museum pieces', 'exhibits', 'what can i see'],
  'Our collection includes rare artifacts from Tunisia''s rich history. Explore our Artifacts page to view 3D models and detailed information about each piece.',
  'Notre collection comprend des artefacts rares de la riche histoire de la Tunisie. Explorez notre page Artefacts pour voir des modèles 3D et des informations détaillées sur chaque pièce.',
  'تضم مجموعتنا قطعًا أثرية نادرة من تاريخ تونس الغني. استكشف صفحة القطع الأثرية لمشاهدة نماذج ثلاثية الأبعاد ومعلومات مفصلة عن كل قطعة.',
  8,
  TRUE
);

-- 5. Contact Information
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'contact',
  ARRAY['contact', 'email', 'phone', 'address', 'location', 'how to reach', 'where are you located', 'contact information'],
  'You can contact us at: Phone: +216 25 310 666, Email: contact@goldenmadina.art, Address: 123 Heritage Street, Historical Quarter.',
  'Vous pouvez nous contacter au : Téléphone : +216 25 310 666, Email : contact@goldenmadina.art, Adresse : 123 Rue du Patrimoine, Quartier Historique.',
  'يمكنك الاتصال بنا على: الهاتف: +216 25 310 666، البريد الإلكتروني: contact@goldenmadina.art، العنوان: 123 شارع التراث، الحي التاريخي.',
  7,
  TRUE
);

-- 6. Opening Hours
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'opening_hours',
  ARRAY['opening hours', 'when are you open', 'hours', 'schedule', 'visiting hours', 'when can i visit', 'closing time'],
  'We are open Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM, and closed on Sundays and public holidays.',
  'Nous sommes ouverts du lundi au vendredi : 9h00 - 18h00, samedi : 10h00 - 16h00, et fermés les dimanches et jours fériés.',
  'نحن مفتوحون من الاثنين إلى الجمعة: 9:00 صباحًا - 6:00 مساءً، السبت: 10:00 صباحًا - 4:00 مساءً، ومغلق أيام الأحد والعطلات الرسمية.',
  7,
  TRUE
);

-- 7. Booking Information
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'booking',
  ARRAY['booking', 'reservation', 'how to book', 'reserve', 'appointment', 'schedule a visit', 'guided tour booking'],
  'You can book our services directly through our website''s booking page. Select your preferred service, date, and provide your contact details.',
  'Vous pouvez réserver nos services directement via la page de réservation de notre site web. Sélectionnez le service souhaité, la date et fournissez vos coordonnées.',
  'يمكنك حجز خدماتنا مباشرة من خلال صفحة الحجز على موقعنا. اختر الخدمة المفضلة لديك والتاريخ وقدم تفاصيل الاتصال الخاصة بك.',
  6,
  TRUE
);

-- 8. Blog and News
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'blog',
  ARRAY['blog', 'news', 'articles', 'latest news', 'updates', 'recent posts', 'what''s new'],
  'Check our blog for the latest articles about heritage preservation, event announcements, and behind-the-scenes stories from our team.',
  'Consultez notre blog pour les derniers articles sur la préservation du patrimoine, les annonces d''événements et les coulisses de notre équipe.',
  'تحقق من مدونتنا للحصول على أحدث المقالات حول الحفاظ على التراث وإعلانات الفعاليات والقصص من وراء الكواليس من فريقنا.',
  5,
  TRUE
);

-- 9. Portfolio
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'portfolio',
  ARRAY['portfolio', 'projects', 'past work', 'case studies', 'examples', 'previous projects', 'work examples'],
  'Our portfolio showcases our best work in heritage preservation and cultural projects. Browse by category to see our diverse range of completed projects.',
  'Notre portfolio présente nos meilleurs travaux dans la préservation du patrimoine et les projets culturels. Parcourez par catégorie pour voir notre gamme diversifiée de projets réalisés.',
  'تعرض محفظتنا أفضل أعمالنا في مجال الحفاظ على التراث والمشاريع الثقافية. تصفح حسب الفئة لمشاهدة مجموعتنا المتنوعة من المشاريع المنجزة.',
  5,
  TRUE
);

-- 10. Default Response
INSERT INTO public.chatbot_responses (intent, pattern, response_en, response_fr, response_ar, priority, is_active)
VALUES (
  'default',
  ARRAY['default'],
  'I''m sorry, I don''t have information about that. Please contact us directly for specific inquiries or visit our website for more details.',
  'Je suis désolé, je n''ai pas d''informations à ce sujet. Veuillez nous contacter directement pour des demandes spécifiques ou visiter notre site web pour plus de détails.',
  'آسف، ليس لدي معلومات حول ذلك. يرجى الاتصال بنا مباشرة للاستفسارات المحددة أو زيارة موقعنا الإلكتروني لمزيد من التفاصيل.',
  1,
  TRUE
);
