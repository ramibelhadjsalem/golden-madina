
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useTranslate } from "@/hooks/use-translate";
import { MessageSquare, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SketchfabEmbed from "@/components/sketchupEmbeded";
import ArtifactCommentSheet, { ArtifactComment } from "@/components/ArtifactCommentSheet";

// Define artifact type
type Artifact = {
  id: string;
  name: string;
  period: string;
  description: string;
  category: string;
  model_url: string | null;
  image_url: string;
  location: string | null;
  discovery_date: string | null;
  created_at: string;
  additional_images: string[] | null;
  comments?: ArtifactComment[] | null;
};

const ArtifactDetail = () => {
  const { t } = useTranslate();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const isMounted = useRef(true);

  // Share functionality
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: t('linkCopied'),
          description: t('linkCopiedToClipboard'),
        });
      })
      .catch(() => {
        toast({
          title: t('error'),
          description: t('failedToCopyLink'),
          variant: 'destructive',
        });
      });
  };

  // Handle comment updates
  const handleCommentsChange = (updatedComments: ArtifactComment[]) => {
    if (artifact) {
      setArtifact({
        ...artifact,
        comments: updatedComments
      });
    }
  };

  // Fetch artifact from Supabase
  useEffect(() => {
    const fetchArtifact = async () => {
      if (!id) {
        navigate('/404');
        return;
      }

      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching artifact:', error);
          if (isMounted.current) {
            // Redirect to 404 page if artifact not found
            navigate('/404');
          }
          return;
        }

        if (isMounted.current) {
          if (data) {
            setArtifact(data as Artifact);
          } else {
            // Redirect to 404 page if artifact not found
            navigate('/404');
          }
        }
      } catch (err) {
        console.error('Error:', err);
        if (isMounted.current) {
          // Redirect to 404 page on error
          navigate('/404');
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
  }, [id, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/artifacts" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              {t('backToCollection')}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image skeleton */}
            <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="w-16 h-16 rounded-md" />
                ))}
              </div>
            </div>

            {/* Right: Content skeleton */}
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Redirect to 404 if artifact is not found (this is a fallback, should be handled by the useEffect)
  if (!artifact) {
    navigate('/404');
    return null;
  }

  const allImages = [artifact.image_url, ...(artifact.additional_images || [])];

  return (
    <main className="flex-grow py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/artifacts" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images and 3D Model */}
          <div>
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
              {showModel && artifact.model_url ? (
                <div className="aspect-square w-full bg-slate-200 flex flex-col items-center justify-center text-center">
                  <SketchfabEmbed modelUrl={artifact.model_url} />
                </div>
              ) : (
                <img
                  src={allImages[activeImageIndex]}
                  alt={artifact.name}
                  className="w-full h-full object-contain aspect-square"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                  }}
                />
              )}
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveImageIndex(index);
                      setShowModel(false);
                    }}
                    className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${activeImageIndex === index && !showModel
                      ? "border-amber-500"
                      : "border-transparent"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                      }}
                    />
                  </button>
                ))}
              </div>

              {artifact.model_url && (
                <Button
                  onClick={() => setShowModel(true)}
                  variant={showModel ? "default" : "outline"}
                  className={showModel ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  3D View
                </Button>
              )}
            </div>
          </div>

          {/* Right: Artifact Details */}
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{artifact.name}</h1>
            <p className="text-slate-500 mb-6">{artifact.period} • {artifact.category}</p>

            {/* Comment and Share Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsCommentSheetOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                {t('comments')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={copyLinkToClipboard}
              >
                <Share2 className="h-4 w-4" />
                {t('share')}
              </Button>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: artifact.description }} />
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('location')}</h3>
                    <p>{artifact.location || t('notAvailable')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('category')}</h3>
                    <p>{artifact.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('period')}</h3>
                    <p>{artifact.period}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('discoveryDate')}</h3>
                    <p>{artifact.discovery_date ? new Date(artifact.discovery_date).toLocaleDateString() : t('notAvailable')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">{t('dateAdded')}</h3>
                    <p>{new Date(artifact.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Comments Sheet */}
        {artifact && (
          <ArtifactCommentSheet
            isOpen={isCommentSheetOpen}
            onOpenChange={setIsCommentSheetOpen}
            artifactId={artifact.id}
            comments={artifact.comments || []}
            onCommentsChange={handleCommentsChange}
          />
        )}
      </div>
    </main>
  );
};

export default ArtifactDetail;
