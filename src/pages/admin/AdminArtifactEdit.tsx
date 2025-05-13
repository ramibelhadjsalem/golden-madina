import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";

// Define consistent type for artifacts
type Artifact = {
  id: string;
  name: string;
  period: string;
  category: string;
  image_url: string;
  model_url: string | null;
  description: string;
  location: string | null;
  discovery_date: string | null;
  created_at: string;
  additional_images: string[] | null;
};

const AdminArtifactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use a ref to track if we've already fetched the data
  const hasFetchedRef = useRef(false);

  // Form state
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [discoveryDate, setDiscoveryDate] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [showModel, setShowModel] = useState(false);

  // Define fetchArtifact function without useCallback to avoid dependency issues
  const fetchArtifact = async () => {
    if (!id) {
      setError(t('invalidArtifactId'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("artifacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Artifact not found");

      const artifactData = data as Artifact;
      setArtifact(artifactData);

      // Populate form state
      setName(artifactData.name);
      setPeriod(artifactData.period);
      setCategory(artifactData.category);
      setDescription(artifactData.description);
      setLocation(artifactData.location || "");
      setDiscoveryDate(artifactData.discovery_date || "");
      setModelUrl(artifactData.model_url || "");
      setMainImage(artifactData.image_url);
      setAdditionalImages(artifactData.additional_images || []);
    } catch (err) {
      console.error("Error fetching artifact:", err);
      const errorMessage =
        err instanceof Error && err.message.includes("not found")
          ? t("artifactNotFound")
          : t("errorFetchingArtifact");
      setError(errorMessage);
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch artifact on mount only if we haven't fetched it yet
  useEffect(() => {
    if (!hasFetchedRef.current && id) {
      fetchArtifact();
      hasFetchedRef.current = true;
    }

    // Reset the ref when the id changes
    return () => {
      hasFetchedRef.current = false;
    };
  }, [id]);

  const handleSaveArtifact = async () => {
    if (!artifact) return;

    try {
      setIsSaving(true);

      // Prepare the artifact data for saving
      const artifactData = {
        name,
        period,
        category,
        description,
        location: location || null,
        discovery_date: discoveryDate || null,
        model_url: modelUrl || null,
        image_url: mainImage,
        additional_images: additionalImages.length > 0 ? additionalImages : null
      };

      const { data, error } = await supabase
        .from("artifacts")
        .update(artifactData)
        .eq("id", artifact.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (data) {
        // Update the artifact state directly without triggering a refetch
        setArtifact(data as Artifact);
        toast({
          title: t("artifactUpdated"),
          description: t("artifactUpdateSuccess"),
        });
      }
    } catch (err) {
      console.error("Error saving artifact:", err);
      toast({
        title: t("error"),
        description: t("errorSavingArtifact"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <div className="text-slate-500">{error || t("artifactNotFound")}</div>
        <p className="text-slate-400 mt-2">{t('tryAgainLater')}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/artifacts")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToArtifacts")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/artifacts')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToArtifacts')}
          </Button>
        </div>
        <Button
          onClick={handleSaveArtifact}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t('saving') : t('save')}
        </Button>
      </div>

      {/* Artifact Form - Layout similar to ArtifactDetail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images and 3D Model */}
        <div>
          <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
            {showModel && modelUrl ? (
              <div className="aspect-square w-full bg-slate-200 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-700 mb-2">{t('3dModelViewer')}</h3>
                <p className="text-slate-500 mb-4">
                  {t('3dModelViewerDescription')}
                </p>
                <div className="space-y-4 w-full max-w-md">
                  <Input
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    placeholder={t('enter3dModelUrl')}
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowModel(false)}
                  >
                    {t('viewImages')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-square w-full relative">
                <div className="w-full h-full" onClick={() => {
                  // Create a file input element and trigger it
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (!files || files.length === 0) return;

                    try {
                      const file = files[0];
                      const { uploadFile } = await import('@/lib/storage-utils');
                      const fileUrl = await uploadFile(file, 'artifacts', 'images');
                      if (fileUrl) {
                        setMainImage(fileUrl);
                      }
                    } catch (error) {
                      console.error('Error uploading file:', error);
                    }
                  };
                  input.click();
                }}>
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt=""
                      className="w-full h-full object-contain cursor-pointer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 cursor-pointer">
                      <p className="text-slate-500">{t('noFileSelected')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2 overflow-x-auto py-2">
              {/* Main image thumbnail */}
              {mainImage && (
                <div
                  className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${!showModel ? "border-amber-500" : "border-transparent"}`}
                >
                  <img
                    src={mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}

              {/* Additional images thumbnails */}
              {additionalImages.map((img, index) => (
                <div key={index} className="relative group w-16 h-16">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 border-transparent">
                    <img
                      src={img}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white"
                      onClick={() => {
                        const newImages = [...additionalImages];
                        newImages.splice(index, 1);
                        setAdditionalImages(newImages);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add new image button */}
              <div
                className="w-16 h-16 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  // Create a file input element and trigger it
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (!files || files.length === 0) return;

                    try {
                      const file = files[0];
                      const { uploadFile } = await import('@/lib/storage-utils');
                      const fileUrl = await uploadFile(file, 'artifacts', 'images');
                      if (fileUrl) {
                        setAdditionalImages([...additionalImages, fileUrl]);
                      }
                    } catch (error) {
                      console.error('Error uploading file:', error);
                    }
                  };
                  input.click();
                }}
              >
                <div className="text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
            </div>

            {modelUrl && (
              <Button
                onClick={() => setShowModel(true)}
                variant={showModel ? "default" : "outline"}
                className={showModel ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {t('3dView')}
              </Button>
            )}
          </div>
        </div>

        {/* Right: Artifact Details */}
        <div>
          <div className="mb-6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterArtifactName')}
              className="text-2xl font-bold mb-2"
            />
            <div className="flex gap-2">
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder={t('periodPlaceholder')}
                className="text-slate-500"
              />
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t('categoryPlaceholder')}
                className="text-slate-500"
              />
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="description">{t('description')}</TabsTrigger>
              <TabsTrigger value="details">{t('details')}</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('enterArtifactDescription')}
                className="min-h-[300px] w-full"
              />
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">{t('location')}</h3>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t('locationPlaceholder')}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">{t('discoveryDate')}</h3>
                  <Input
                    type="date"
                    value={discoveryDate}
                    onChange={(e) => setDiscoveryDate(e.target.value)}
                  />
                </div>
                {artifact.created_at && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('dateAdded')}</h3>
                    <p>{new Date(artifact.created_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminArtifactEdit;
