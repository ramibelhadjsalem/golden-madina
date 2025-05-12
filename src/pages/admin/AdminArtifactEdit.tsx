import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import ArtifactDialog from "@/components/admin/ArtifactDialog";

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

// Define the input type for the dialog
type ArtifactInput = {
  name: string;
  period: string;
  category: string;
  image_url: string;
  model_url: string | null;
  description: string;
  location?: string | null;
  discovery_date?: string | null;
  additional_images?: string[] | null;
};

const AdminArtifactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useRef(true);

  // Fetch artifact by ID
  useEffect(() => {
    const fetchArtifact = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!isMounted.current) return;

        if (data) {
          setArtifact(data as Artifact);
        } else {
          throw new Error('Artifact not found');
        }
      } catch (err) {
        console.error('Error fetching artifact:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          toast({
            title: t('error'),
            description: t('errorFetchingArtifact'),
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchArtifact();

    return () => {
      isMounted.current = false;
    };
  }, [id, t]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveArtifact = async (artifactData: ArtifactInput) => {
    if (!artifact) return;
    
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('artifacts')
        .update(artifactData)
        .eq('id', artifact.id)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setArtifact(data as Artifact);
        
        toast({
          title: t('artifactUpdated'),
          description: t('artifactUpdateSuccess'),
        });
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving artifact:', err);
      toast({
        title: t('error'),
        description: t('errorSavingArtifact'),
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
        <div className="text-slate-500">{t('artifactNotFound')}</div>
        <p className="text-slate-400 mt-2">{error?.message || t('tryAgainLater')}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/artifacts')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToArtifacts')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
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
            onClick={handleOpenDialog}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {t('editArtifact')}
          </Button>
        </div>

        {/* Artifact Details */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="aspect-square w-full overflow-hidden rounded-lg relative">
                  <img
                    src={artifact.image_url}
                    alt={artifact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                    }}
                  />
                  {artifact.model_url && (
                    <div className="absolute bottom-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      3D Model
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{t('details')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-slate-500">{t('name')}</p>
                      <p className="font-medium">{artifact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t('period')}</p>
                      <p className="font-medium">{artifact.period}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t('category')}</p>
                      <p className="font-medium">{artifact.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t('location')}</p>
                      <p className="font-medium">{artifact.location || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t('discoveryDate')}</p>
                      <p className="font-medium">{artifact.discovery_date || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t('dateAdded')}</p>
                      <p className="font-medium">{new Date(artifact.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{t('description')}</h2>
                  <p className="mt-2 text-slate-700 whitespace-pre-line">{artifact.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Artifact Dialog */}
      <ArtifactDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        artifact={artifact}
        onSave={handleSaveArtifact}
      />
    </>
  );
};

export default AdminArtifactEdit;
