-- SQL commands to update the portfolios table schema

-- 1. First, add the new images column
ALTER TABLE portfolios
ADD COLUMN images TEXT[] DEFAULT NULL;

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
  END;

-- 3. Add a comment to explain the column
COMMENT ON COLUMN portfolios.images IS 'Array of image URLs for the portfolio item';

-- Note: We're keeping the old columns for backward compatibility
-- In the future, you might want to remove them with:
-- ALTER TABLE portfolios DROP COLUMN image_url;
-- ALTER TABLE portfolios DROP COLUMN additional_images;
