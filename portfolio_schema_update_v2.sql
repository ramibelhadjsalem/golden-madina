-- SQL commands to update the portfolios table schema to remove main image concept

-- 1. First, make sure the images column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'portfolios' 
        AND column_name = 'images'
    ) THEN
        -- Add the images column if it doesn't exist
        ALTER TABLE portfolios
        ADD COLUMN images TEXT[] DEFAULT NULL;
    END IF;
END
$$;

-- 2. Update existing records to convert from old format to new format
UPDATE portfolios
SET images = 
  CASE 
    WHEN image_url IS NOT NULL THEN 
      CASE 
        WHEN additional_images IS NOT NULL THEN 
          array_prepend(image_url, additional_images)
        ELSE 
          ARRAY[image_url]
      END
    ELSE 
      NULL
  END
WHERE images IS NULL;

-- 3. Add a comment to explain the column
COMMENT ON COLUMN portfolios.images IS 'Array of image URLs for the portfolio item';

-- Note: We're keeping the old columns for backward compatibility
-- In the future, you might want to remove them with:
-- ALTER TABLE portfolios DROP COLUMN image_url;
-- ALTER TABLE portfolios DROP COLUMN additional_images;
