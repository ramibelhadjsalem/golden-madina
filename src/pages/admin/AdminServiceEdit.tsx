import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

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

const AdminServiceEdit = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState<boolean>(true);
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      try {
        setIsFetching(true);
        setError(null);

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setName(data.name || "");
          setPrice(data.price || 0);
          setDescription(data.description || "");
          setImageUrl(data.image_url || "");
          setAvailable(data.available !== false);
          setMaxCapacity(data.max_capacity || null);
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(t('errorFetchingService'));
        toast({
          title: t('error'),
          description: t('errorFetchingService'),
          variant: 'destructive',
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !imageUrl) {
      toast({
        title: t('missingFields'),
        description: t('fillRequiredFields'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare service data for saving
      const serviceData = {
        name,
        description: description || "",
        price,
        image_url: imageUrl,
        available,
        max_capacity: maxCapacity
      };

      // Update service in Supabase
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('serviceUpdated'),
        description: t('serviceUpdateSuccess'),
      });

      // Navigate back to service list
      navigate('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('errorUpdatingService'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 md:col-span-1">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-6 md:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/services')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToServices')}
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-red-600 mb-2">{t('somethingWentWrong')}</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            {t('tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/services')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToServices')}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 md:col-span-1">
              {/* Service Image */}
              <div className="space-y-2">
                <FileUploadField
                  label={t('serviceImage')}
                  value={imageUrl}
                  onChange={setImageUrl}
                  placeholder={t('enterImageUrlField')}
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
              <div className="space-y-2">
                <Label htmlFor="name">{t('serviceName')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterServiceName')}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
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

              {/* Max Capacity and Availability in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="available" className="block mb-2">{t('availability')}</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={available}
                      onCheckedChange={setAvailable}
                    />
                    <Label htmlFor="available" className="cursor-pointer">
                      {available ? t('serviceAvailable') : t('serviceUnavailable')}
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 md:col-span-1">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enterServiceDescription')}
                  className="h-[calc(100%-2.5rem)]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/services')}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('saving')}
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('saveChanges')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceEdit;
