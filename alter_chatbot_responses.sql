-- Alter the chatbot_responses table to change the field name from 'patterns' to 'pattern'
ALTER TABLE public.chatbot_responses 
  RENAME COLUMN patterns TO pattern;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chatbot_responses' AND table_schema = 'public';
