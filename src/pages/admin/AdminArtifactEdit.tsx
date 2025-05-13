import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
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
  const [activeTab, setActiveTab] = useState("details");

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
          <h1 className="text-2xl font-semibold">{artifact.name}</h1>
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

      {/* Artifact Form */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">{t('details')}</TabsTrigger>
              <TabsTrigger value="description">{t('description')}</TabsTrigger>
              <TabsTrigger value="images">{t('images')}</TabsTrigger>
              <TabsTrigger value="3dModel">{t('3dModel')}</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
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
            </TabsContent>

            {/* Description Tab */}
            <TabsContent value="description">
              <div className="grid gap-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enterArtifactDescription')}
                  className="min-h-[300px]"
                />
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images">
              <ImageGalleryManager
                mainImage={mainImage}
                additionalImages={additionalImages}
                onMainImageChange={setMainImage}
                onAdditionalImagesChange={setAdditionalImages}
                bucket="artifacts"
                folder="images"
              />
            </TabsContent>

            {/* 3D Model Tab */}
            <TabsContent value="3dModel">
              <div className="grid gap-4">
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

                {modelUrl && (
                  <div className="bg-slate-100 rounded-lg p-6 text-center">
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
                    <p className="text-sm text-blue-600 break-all">{modelUrl}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArtifactEdit;
