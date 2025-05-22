
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useTranslate } from "@/hooks/use-translate";

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
};

// Available categories for filtering - will be dynamically populated
const DEFAULT_CATEGORIES = ["All", "Pottery", "Books", "Ceremonial", "Jewelry", "Sculpture", "Decorative Arts"];

const ArtifactsPage = () => {
  const { t } = useTranslate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [show3dOnly, setShow3dOnly] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  // Fetch artifacts from Supabase
  useEffect(() => {
    const fetchArtifacts = async () => {
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

          // Extract unique categories from the data
          const uniqueCategories = ["All", ...new Set(data.map((item: Artifact) => item.category))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Error fetching artifacts:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchArtifacts();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Filter artifacts based on search term, category, and 3D model availability
  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || artifact.category === selectedCategory;

    const matches3dFilter = !show3dOnly || artifact.model_url !== null;

    return matchesSearch && matchesCategory && matches3dFilter;
  });

  return (
    <main className="flex-grow">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{t('heritageCollection')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('artifactsPageDescription') }
          </p>
        </div>
      </section>

      {/* Filters & Artifacts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-6">{t('filterCollection') || 'Filter Collection'}</h2>

                {/* Search */}
                <div className="mb-6">
                  <Label htmlFor="search">{t('search') || 'Search'}</Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder={t('searchArtifactsPlaceholder') || 'Search artifacts...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">{t('categories') || 'Categories'}</h3>
                  <div className="space-y-2">
                    {isLoading ? (
                      // Loading skeleton for categories
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))
                    ) : (
                      categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={category}
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="mr-2 h-4 w-4 border-slate-300 text-slate-800 focus:ring-slate-500"
                          />
                          <label htmlFor={category} className="text-sm text-slate-700">
                            {category}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3D Model Filter */}
                <div className="mb-6 flex items-center space-x-2">
                  <Checkbox
                    id="3dmodels"
                    checked={show3dOnly}
                    onCheckedChange={() => setShow3dOnly(!show3dOnly)}
                  />
                  <label
                    htmlFor="3dmodels"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('showOnly3dModels') || 'Show only items with 3D models'}
                  </label>
                </div>
              </div>
            </div>

            {/* Artifacts Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                // Loading skeleton for artifacts grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square w-full bg-slate-200 animate-pulse" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-4 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg">
                  <h3 className="text-2xl font-semibold text-slate-700 mb-2">{t('errorOccurred') || 'An Error Occurred'}</h3>
                  <p className="text-slate-500">{t('tryAgainLater') || 'Please try again later'}</p>
                </div>
              ) : filteredArtifacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {artifact.model_url && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            {t('has3dModel') || '3D Model'}
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="font-serif">{artifact.name}</CardTitle>
                        <p className="text-sm text-slate-500">{artifact.period} • {artifact.category}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 line-clamp-2">{artifact.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Link
                          to={`/artifacts/${artifact.id}`}
                          className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                        >
                          {t('viewDetails') || 'View Details'} →
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-lg">
                  <h3 className="text-2xl font-semibold text-slate-700 mb-2">{t('noArtifactsFound') || 'No Artifacts Found'}</h3>
                  <p className="text-slate-500">{t('adjustSearchCriteria') || 'Try adjusting your search criteria'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArtifactsPage;
