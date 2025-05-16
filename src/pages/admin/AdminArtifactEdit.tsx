import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";

import SketchfabEmbed from "@/components/sketchupEmbeded";
import ImageGalleryManager from "@/components/admin/ImageGalleryManager";

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

  // Define fetchArtifact function with useCallback
  const fetchArtifact = useCallback(async () => {
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
  }, [id, t]);

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
          // className="bg-blue-600 hover:bg-blue-700"
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Image Gallery Manager */}
            <ImageGalleryManager
              mainImage={mainImage}
              additionalImages={additionalImages}
              onMainImageChange={setMainImage}
              onAdditionalImagesChange={setAdditionalImages}
              bucket="artifacts"
              folder="images"
            />
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
              <div className="space-y-6">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enterArtifactDescription')}
                  className="min-h-[300px] w-full"
                />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-500">{t('3dModel')}</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={modelUrl}
                      onChange={(e) => setModelUrl(e.target.value)}
                      placeholder={t('enter3dModelUrl')}
                      className="flex-1"
                    />
                    <label
                      htmlFor="model-upload-input"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                    >
                      {isSaving ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent mr-2"></div>
                      ) : null}
                      {t('upload')}
                    </label>
                    <input
                      id="model-upload-input"
                      type="file"
                      accept=".glb,.gltf"
                      className="sr-only"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        const file = files[0];

                        // Reset the input value so the same file can be selected again
                        e.target.value = '';

                        // Validate file size (max 10MB)
                        const fileSizeMB = file.size / (1024 * 1024);
                        if (fileSizeMB > 10) {
                          toast({
                            title: t('fileTooLarge'),
                            description: t('fileSizeExceedsLimit').replace('{size}', '10MB'),
                            variant: 'destructive',
                          });
                          return;
                        }

                        try {
                          setIsSaving(true);

                          // Generate a unique file name
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                          const filePath = `models/${fileName}`;

                          // Upload the file to Supabase Storage
                          const { data, error } = await supabase.storage
                            .from('artifacts')
                            .upload(filePath, file, {
                              cacheControl: '3600',
                              upsert: true,
                            });

                          if (error) throw error;

                          // Get the public URL
                          const { data: urlData } = supabase.storage
                            .from('artifacts')
                            .getPublicUrl(data.path);

                          const fileUrl = urlData.publicUrl;

                          // Set the model URL
                          setModelUrl(fileUrl);

                          toast({
                            title: t('success'),
                            description: t('modelUploaded'),
                          });
                        } catch (error) {
                          console.error('Error uploading file:', error);
                          toast({
                            title: t('error'),
                            description: error instanceof Error ? error.message : t('failedToUploadFile'),
                            variant: 'destructive',
                          });
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{t('supported3dFormats')}</p>

                  {modelUrl && (
                    <div className="mt-4 bg-slate-100 rounded-md">
                      <div className="mt-4 aspect-square w-full bg-slate-200 flex flex-col items-center justify-center text-center rounded-md overflow-hidden">
                        <SketchfabEmbed modelUrl={artifact.model_url} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setModelUrl('');
                          setShowModel(false);
                        }}
                      >
                        {t('remove')}
                      </Button>
                    </div>

                  )}
                </div>
              </div>
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
