import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Plus, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";

interface PortfolioImageManagerProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
}

const PortfolioImageManager = ({
  images,
  onImagesChange,
  bucket = "artifacts",
  folder = "images"
}: PortfolioImageManagerProps) => {
  const { t } = useTranslate();
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});

  // Add a new empty image slot
  const handleAddImage = () => {
    // Create a copy of the current array to avoid direct state mutation
    const newImages = [...images];
    
    // Add a placeholder URL to the images array
    // Using a placeholder instead of empty string to prevent it from being filtered out
    const placeholderUrl = "placeholder-" + Date.now();
    newImages.push(placeholderUrl);
    
    // Update the state with the new array
    onImagesChange(newImages);
    
    // Log for debugging
    console.log("Added new image slot. New array:", newImages);
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onImagesChange(newImages);
  };

  const handleImageError = (index: number, error: string) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: error
    }));
  };

  const handleDeleteClick = (index: number) => {
    setImageToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (imageToDelete !== null) {
      const newImages = [...images];
      newImages.splice(imageToDelete, 1);
      onImagesChange(newImages);
      
      // Clear the error for this index if it exists
      if (imageErrors[imageToDelete]) {
        const newErrors = { ...imageErrors };
        delete newErrors[imageToDelete];
        setImageErrors(newErrors);
      }
    }
    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      onImagesChange(newImages);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="text-lg font-medium">{t('portfolioImages')}</h3>
        <p className="text-sm text-slate-500">{t('portfolioImagesDescription')}</p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative border rounded-md p-4">
            <div className="relative">
              <FileUploadField
                value={image}
                onChange={(url) => handleImageChange(index, url)}
                accept="image/*"
                maxSizeMB={2}
                bucket={bucket}
                folder={folder}
                showPreview={true}
                previewWidth="100%"
                previewHeight={200}
                error={imageErrors[index]}
                onError={(error) => handleImageError(index, error)}
              />
              {imageErrors[index] && (
                <div className="mt-2 flex items-center text-red-500 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {imageErrors[index]}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-3 pt-2 border-t">
              <div className="flex space-x-1">
                {/* Empty div to maintain layout */}
                <div></div>
              </div>
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8 hover:bg-slate-100"
                  title={t('moveUp')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === images.length - 1}
                  className="h-8 w-8 hover:bg-slate-100"
                  title={t('moveDown')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(index)}
                  className="h-8 w-8 hover:bg-slate-100 text-red-600"
                  title={t('deleteImage')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Image Card */}
        <div 
          className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={handleAddImage}
          style={{ minHeight: '300px' }}
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">{t('addImage')}</p>
          <p className="text-slate-400 text-sm text-center mt-2">{t('clickToAddImage')}</p>
        </div>
      </div>

      {/* Show empty state only when there are no images */}
      {images.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-md">
          <p className="text-slate-500">{t('noImages')}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddImage}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('addImage')}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteImage')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteImageWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfolioImageManager;
