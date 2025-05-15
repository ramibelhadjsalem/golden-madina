import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";

// Define the Service type based on our Supabase schema
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_url: string;
  available: boolean;
  max_capacity: number | null;
  created_at: string;
}

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service;
  onSave: (service: {
    name: string;
    description: string;
    duration: number;
    price: number;
    image_url: string;
    available: boolean;
    max_capacity: number | null;
  }) => void;
}

const ServiceDialog = ({ isOpen, onClose, service, onSave }: ServiceDialogProps) => {
  const { t } = useTranslate();
  const [name, setName] = useState(service?.name || "");
  const [duration, setDuration] = useState<number>(service?.duration || 60);
  const [price, setPrice] = useState<number>(service?.price || 0);
  const [description, setDescription] = useState(service?.description || "");
  const [imageUrl, setImageUrl] = useState(service?.image_url || "");
  const [available, setAvailable] = useState<boolean>(service?.available !== false);
  const [maxCapacity, setMaxCapacity] = useState<number | null>(service?.max_capacity || null);
  const [isLoading, setIsLoading] = useState(false);

  // Update form state when service changes
  useEffect(() => {
    if (service) {
      setName(service.name || "");
      setDuration(service.duration || 60);
      setPrice(service.price || 0);
      setDescription(service.description || "");
      setImageUrl(service.image_url || "");
      setAvailable(service.available !== false);
      setMaxCapacity(service.max_capacity || null);
    } else {
      // Reset form for new service
      setName("");
      setDuration(60);
      setPrice(0);
      setDescription("");
      setImageUrl("");
      setAvailable(true);
      setMaxCapacity(null);
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !imageUrl) {
      toast({
        title: t('missingFields'),
        description: t('fillRequiredFields'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Prepare service data for saving
    onSave({
      name,
      description: description || "",
      duration,
      price,
      image_url: imageUrl,
      available,
      max_capacity: maxCapacity
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{service ? t('editService') : t('createNewService')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Service Image */}
            <div className="grid gap-2">
              <FileUploadField
                label={t('serviceImage')}
                value={imageUrl}
                onChange={setImageUrl}
                placeholder={t('enterImageUrl')}
                accept="image/*"
                maxSizeMB={2}
                bucket="artifacts"
                folder="services"
                showPreview={true}
                previewWidth="100%"
                previewHeight={200}
                description={t('recommendedImageSize')}
                required
              />
            </div>

            {/* Service Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterServiceName')}
                required
              />
            </div>

            {/* Duration and Price in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">{t('durationMinutes')}</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                  placeholder="60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t('price')}</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Max Capacity and Availability in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxCapacity">{t('maxCapacity')}</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min={1}
                  value={maxCapacity || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : null;
                    setMaxCapacity(value);
                  }}
                  placeholder={t('optional')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="available">{t('availability')}</Label>
                <div className="flex items-center h-10 space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="available" className="text-sm text-gray-700">
                    {t('serviceAvailable')}
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('enterServiceDescription')}
                className="h-40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
