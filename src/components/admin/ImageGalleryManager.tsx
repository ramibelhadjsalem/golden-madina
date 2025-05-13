import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";

interface ImageGalleryManagerProps {
  mainImage: string;
  additionalImages: string[];
  onMainImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
}

const ImageGalleryManager = ({
  mainImage,
  additionalImages,
  onMainImageChange,
  onAdditionalImagesChange,
  bucket = "artifacts",
  folder = "images"
}: ImageGalleryManagerProps) => {
  const { t } = useTranslate();
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddImage = () => {
    onAdditionalImagesChange([...additionalImages, ""]);
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...additionalImages];
    newImages[index] = url;
    onAdditionalImagesChange(newImages);
  };

  const handleDeleteClick = (index: number) => {
    setImageToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete !== null) {
      const newImages = [...additionalImages];
      newImages.splice(imageToDelete, 1);
      onAdditionalImagesChange(newImages);
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newImages = [...additionalImages];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      onAdditionalImagesChange(newImages);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < additionalImages.length - 1) {
      const newImages = [...additionalImages];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      onAdditionalImagesChange(newImages);
    }
  };

  const handlePromoteToMain = (index: number) => {
    const imageToPromote = additionalImages[index];
    const newAdditionalImages = [...additionalImages];
    
    // Remove the image from additional images
    newAdditionalImages.splice(index, 1);
    
    // Add the current main image to additional images if it exists
    if (mainImage) {
      newAdditionalImages.unshift(mainImage);
    }
    
    // Set the selected image as the main image
    onMainImageChange(imageToPromote);
    onAdditionalImagesChange(newAdditionalImages);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div>
        <h3 className="text-lg font-medium mb-2">{t('mainImage')}</h3>
        <FileUploadField
          value={mainImage}
          onChange={onMainImageChange}
          accept="image/*"
          maxSizeMB={2}
          bucket={bucket}
          folder={folder}
          showPreview={true}
          previewWidth="100%"
          previewHeight={300}
          description={t('mainImageDescription')}
        />
      </div>

      {/* Additional Images */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">{t('additionalImages')}</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddImage}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('addImage')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalImages.map((image, index) => (
            <div key={index} className="relative border rounded-md p-4">
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handlePromoteToMain(index)}
                  className="h-8 w-8 bg-white/80 hover:bg-white text-blue-600"
                  title={t('setAsMainImage')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  title={t('moveUp')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMoveDown(index)}
                  disabled={index === additionalImages.length - 1}
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  title={t('moveDown')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteClick(index)}
                  className="h-8 w-8 bg-white/80 hover:bg-white text-red-600"
                  title={t('deleteImage')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
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
              />
            </div>
          ))}
        </div>
        
        {additionalImages.length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-md">
            <p className="text-slate-500">{t('noAdditionalImages')}</p>
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
      </div>

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
              onClick={handleDeleteConfirm}
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

export default ImageGalleryManager;
