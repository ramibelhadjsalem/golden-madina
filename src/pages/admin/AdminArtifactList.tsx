
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ArtifactDialog from "@/components/admin/ArtifactDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
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

// Artifact card skeleton for loading state
const ArtifactCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="aspect-square w-full overflow-hidden bg-slate-200 animate-pulse" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-24" />
    </CardFooter>
  </Card>
);

const AdminArtifactList = () => {
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [artifactToDelete, setArtifactToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const hasFetchedRef = useRef(false);

  // Debounce search term to prevent too many fetches
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch artifacts function - simplified to avoid infinite fetches
  const fetchArtifacts = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!isMounted.current) return;

      if (data) {
        setArtifacts(data as Artifact[]);
      }
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast({
          title: t('error'),
          description: t('errorFetchingArtifacts'),
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [t]);

  // Fetch artifacts only once on component mount
  useEffect(() => {
    // Only fetch if we haven't already
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchArtifacts();
    }

    // Reset fetch flag when component unmounts
    return () => {
      hasFetchedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure it only runs once

  const filteredArtifacts = artifacts.filter(artifact => {
    if (debouncedSearchTerm.length < 1) return true;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return artifact.name.toLowerCase().includes(searchLower) ||
      artifact.category.toLowerCase().includes(searchLower) ||
      artifact.period.toLowerCase().includes(searchLower) ||
      (artifact.description && artifact.description.toLowerCase().includes(searchLower));
  });

  const handleOpenDialog = (artifact?: Artifact) => {
    setSelectedArtifact(artifact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedArtifact(undefined);
    setIsDialogOpen(false);
  };

  const handleSaveArtifact = async (artifactData: ArtifactInput) => {
    try {
      if (selectedArtifact) {
        // Update existing artifact
        const { data, error } = await supabase
          .from('artifacts')
          .update(artifactData)
          .eq('id', selectedArtifact.id)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          // Update the artifacts list with the updated artifact
          setArtifacts(artifacts.map(artifact =>
            artifact.id === selectedArtifact.id ? data as Artifact : artifact
          ));

          toast({
            title: t('artifactUpdated'),
            description: t('artifactUpdateSuccess'),
          });
        }
      } else {
        // Create new artifact
        const { data, error } = await supabase
          .from('artifacts')
          .insert([artifactData])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          // Add the new artifact to the beginning of the list
          setArtifacts([data as Artifact, ...artifacts]);

          toast({
            title: t('artifactCreated'),
            description: t('artifactCreateSuccess'),
          });
        }
      }

      // Close the dialog
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving artifact:', err);
      toast({
        title: t('error'),
        description: t('errorSavingArtifact'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setArtifactToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (artifactToDelete) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('artifacts')
          .delete()
          .eq('id', artifactToDelete);

        if (error) throw error;

        setArtifacts(artifacts.filter(artifact => artifact.id !== artifactToDelete));

        toast({
          title: t('artifactDeleted'),
          description: t('artifactDeleteSuccess'),
        });
      } catch (err) {
        console.error('Error deleting artifact:', err);
        toast({
          title: t('error'),
          description: t('errorDeletingArtifact'),
          variant: "destructive",
        });
      } finally {
        setIsDeleteAlertOpen(false);
        setArtifactToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <div className="relative">
            <Input
              placeholder={t('searchArtifacts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <p className="text-xs text-amber-600 mt-1 ml-1">
              {t('enterAtLeast3Characters')}
            </p>
          )}
          {searchTerm.length >= 3 && debouncedSearchTerm !== searchTerm && (
            <p className="text-xs text-blue-600 mt-1 ml-1">
              {t('searching')}...
            </p>
          )}
        </div>
        <Button
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addNewArtifact')}
        </Button>
      </div>

      {/* Grid card layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
          {[...Array(8)].map((_, index) => (
            <ArtifactCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <div className="text-slate-500">{t('errorOccurred')}</div>
          <p className="text-slate-400 mt-2">{t('tryAgainLater')}</p>
        </div>
      ) : filteredArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArtifacts.map((artifact) => (
            <Card key={artifact.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full overflow-hidden relative">
                <img
                  src={artifact.image_url}
                  alt={artifact.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate(`/admin/artifacts/${artifact.id}`)}
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t('edit')}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(artifact.id)}
                    className="rounded-full bg-white/80 backdrop-blur-sm text-red-600 hover:bg-white hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t('delete')}</span>
                  </Button>
                </div>
                {artifact.model_url && (
                  <div className="absolute bottom-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    3D
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="font-serif line-clamp-1">{artifact.name}</CardTitle>
                <p className="text-sm text-slate-500">{artifact.period} • {artifact.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-2">{artifact.description}</p>
              </CardContent>
              {/* <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/artifacts/${artifact.id}`)}>
                  <Pencil className="h-4 w-4 mr-2" /> {t('edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(artifact.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> {t('delete')}
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <div className="text-slate-500">{t('noArtifactsFound')}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDialog()}
            className="mt-3"
          >
            {t('addNewArtifact')}
          </Button>
        </div>
      )}

      {/* Artifact Dialog */}
      <ArtifactDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        artifact={selectedArtifact}
        onSave={handleSaveArtifact}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteArtifact')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteArtifactWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                  {t('deleting')}
                </>
              ) : (
                t('delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminArtifactList;
