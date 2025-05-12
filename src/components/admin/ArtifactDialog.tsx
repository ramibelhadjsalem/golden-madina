import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";

interface ArtifactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artifact?: {
    id: string;
    name: string;
    period: string;
    category: string;
    model_url: string | null;
    image_url: string;
    description: string;
    location?: string | null;
    discovery_date?: string | null;
    additional_images?: string[] | null;
  };
  onSave: (artifact: {
    name: string;
    period: string;
    category: string;
    model_url: string | null;
    image_url: string;
    description: string;
    location?: string | null;
    discovery_date?: string | null;
    additional_images?: string[] | null;
  }) => void;
}

const ArtifactDialog = ({ isOpen, onClose, artifact, onSave }: ArtifactDialogProps) => {
  const { t } = useTranslate();
  const [name, setName] = useState(artifact?.name || "");
  const [period, setPeriod] = useState(artifact?.period || "");
  const [category, setCategory] = useState(artifact?.category || "");
  const [modelUrl, setModelUrl] = useState(artifact?.model_url || "");
  const [imageUrl, setImageUrl] = useState(artifact?.image_url || "");
  const [description, setDescription] = useState(artifact?.description || "");
  const [location, setLocation] = useState(artifact?.location || "");
  const [discoveryDate, setDiscoveryDate] = useState(artifact?.discovery_date || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !period || !category || !imageUrl) {
      toast({
        title: t('missingFields'),
        description: t('fillRequiredFields'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Prepare the artifact data for saving
    onSave({
      name,
      period,
      category,
      model_url: modelUrl || null,
      image_url: imageUrl,
      description: description || "",
      location: location || null,
      discovery_date: discoveryDate || null
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{artifact ? t('editArtifact') : t('createNewArtifact')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterArtifactName')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period">{t('period')}</Label>
                <Input
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder={t('periodPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('category')}</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t('categoryPlaceholder')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('locationPlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discoveryDate">{t('discoveryDate')}</Label>
              <Input
                id="discoveryDate"
                type="date"
                value={discoveryDate}
                onChange={(e) => setDiscoveryDate(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <FileUploadField
                label={t('artifactImage')}
                value={imageUrl}
                onChange={setImageUrl}
                placeholder={t('enterImageUrl')}
                accept="image/*"
                maxSizeMB={2}
                bucket="artifacts"
                folder="images"
                showPreview={true}
                description={t('recommendedImageSize')}
              />
            </div>

            <div className="grid gap-2">
              <FileUploadField
                label={t('3dModel')}
                value={modelUrl}
                onChange={setModelUrl}
                placeholder={t('enter3dModelUrl')}
                accept=".glb,.gltf"
                maxSizeMB={10}
                bucket="artifacts"
                folder="models"
                showPreview={false}
                description={t('supported3dFormats')}
                required={false}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('enterArtifactDescription')}
                className="h-40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactDialog;
