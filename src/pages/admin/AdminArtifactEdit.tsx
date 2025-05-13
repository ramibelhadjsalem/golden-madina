import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Trash2, GripVertical } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable Image component
interface SortableImageProps {
  id: string;
  url: string;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableImage = ({ id, url, index, isActive, onSelect, onDelete }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-16 h-16"
    >
      <div
        className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 cursor-pointer ${isActive ? "border-amber-500" : "border-transparent"}`}
        onClick={onSelect}
      >
        <img
          src={url}
          alt={`Image ${index + 1}`}
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
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-30"
      >
        <div className="absolute top-1 right-1">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combine main image and additional images for the gallery
  const allImages = mainImage ? [mainImage, ...additionalImages] : [...additionalImages];

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allImages.findIndex(url => url === active.id);
      const newIndex = allImages.findIndex(url => url === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a new array with the reordered images
        const newImages = [...allImages];
        const [movedItem] = newImages.splice(oldIndex, 1);
        newImages.splice(newIndex, 0, movedItem);

        // Update state based on the new order
        if (newImages.length > 0) {
          setMainImage(newImages[0]);
          setAdditionalImages(newImages.slice(1));
        } else {
          setMainImage("");
          setAdditionalImages([]);
        }

        // Update active image index
        setActiveImageIndex(0);
      }
    }
  };

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
                <label className="w-full h-full block cursor-pointer" htmlFor="main-image-input">
                  {allImages.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={allImages[activeImageIndex]}
                        alt=""
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                        }}
                      />
                      {isSaving && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin h-10 w-10 border-4 border-white rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-slate-500">{t('clickToUploadImage')}</p>
                    </div>
                  )}
                </label>
                <input
                  id="main-image-input"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const file = files[0];

                    // Reset the input value so the same file can be selected again
                    e.target.value = '';

                    // Validate file size (max 5MB)
                    const fileSizeMB = file.size / (1024 * 1024);
                    if (fileSizeMB > 5) {
                      toast({
                        title: t('fileTooLarge'),
                        description: t('fileSizeExceedsLimit').replace('{size}', '5MB'),
                        variant: 'destructive',
                      });
                      return;
                    }

                    try {
                      setIsSaving(true);

                      // Generate a unique file name
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                      const filePath = `images/${fileName}`;

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

                      // If there's already a main image, move it to additional images
                      if (mainImage) {
                        setAdditionalImages([mainImage, ...additionalImages]);
                      }

                      // Set the new image as main image
                      setMainImage(fileUrl);
                      setActiveImageIndex(0);

                      toast({
                        title: t('success'),
                        description: t('mainImageUpdated'),
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
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto py-2 ">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={allImages}
                strategy={verticalListSortingStrategy}
              >
                {/* All images as sortable thumbnails */}
                {allImages.map((img, index) => (
                  <SortableImage
                    key={img}
                    id={img}
                    url={img}
                    index={index}
                    isActive={index === activeImageIndex && !showModel}
                    onSelect={() => {
                      setActiveImageIndex(index);
                      setShowModel(false);
                    }}
                    onDelete={() => {
                      // If it's the main image
                      if (index === 0) {
                        // If there are additional images, make the first one the main image
                        if (additionalImages.length > 0) {
                          setMainImage(additionalImages[0]);
                          setAdditionalImages(additionalImages.slice(1));
                        } else {
                          setMainImage("");
                        }
                      } else {
                        // It's an additional image
                        const newImages = [...additionalImages];
                        newImages.splice(index - 1, 1);
                        setAdditionalImages(newImages);
                      }
                      // Reset active image index if needed
                      if (activeImageIndex >= allImages.length - 1) {
                        setActiveImageIndex(0);
                      }
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Add new image button */}
            <label
              className="w-16 h-16 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer relative"
              htmlFor="add-image-input"
            >
              {isSaving ? (
                <div className="animate-spin h-5 w-5 border-2 border-slate-500 rounded-full border-t-transparent"></div>
              ) : (
                <div className="text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              )}
              <input
                id="add-image-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  const file = files[0];

                  // Reset the input value so the same file can be selected again
                  e.target.value = '';

                  // Validate file size (max 5MB)
                  const fileSizeMB = file.size / (1024 * 1024);
                  if (fileSizeMB > 5) {
                    toast({
                      title: t('fileTooLarge'),
                      description: t('fileSizeExceedsLimit').replace('{size}', '5MB'),
                      variant: 'destructive',
                    });
                    return;
                  }

                  try {
                    setIsSaving(true);

                    // Generate a unique file name
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    const filePath = `images/${fileName}`;

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

                    // If there's no main image, set this as the main image
                    if (!mainImage) {
                      setMainImage(fileUrl);
                      setActiveImageIndex(0);
                      toast({
                        title: t('success'),
                        description: t('mainImageAdded'),
                      });
                    } else {
                      setAdditionalImages([...additionalImages, fileUrl]);
                      toast({
                        title: t('success'),
                        description: t('imageAdded'),
                      });
                    }
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
            </label>
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
                    <div className="mt-4 p-4 bg-slate-100 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                          </svg>
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium">{t('3dModelUploaded')}</p>
                          <p className="text-xs text-slate-500 truncate">{modelUrl}</p>
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
