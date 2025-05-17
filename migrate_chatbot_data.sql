-- Migrate data from 'patterns' to 'pattern' field
-- First, add the new column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'chatbot_responses' 
        AND column_name = 'pattern'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.chatbot_responses ADD COLUMN pattern TEXT[] DEFAULT '{}';
    END IF;
END
$$;

-- Copy data from patterns to pattern
UPDATE public.chatbot_responses
SET pattern = patterns
WHERE pattern IS NULL OR pattern = '{}';

-- Verify the data migration
SELECT id, intent, patterns, pattern, response_en
FROM public.chatbot_responses
LIMIT 10;

-- After verifying that the data has been migrated correctly,
-- you can drop the old column
-- ALTER TABLE public.chatbot_responses DROP COLUMN patterns;
