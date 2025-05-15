import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { handleImageError } from "@/lib/utils";

// Define portfolio item type
type Portfolio = {
  id: string;
  name: string;
  description: string;
  content: string;
  image_url: string;
  additional_images: string[] | null;
  category: string;
  created_at: string;
  language: string | null;
};

const PortfolioPage = () => {
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [filteredItems, setFilteredItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch portfolio items from Supabase
        let query = supabase
          .from("portfolios")
          .select("*");

        // // Filter by language if available
        // if (currentLanguage.code) {
        //   query = query.eq("language", currentLanguage.code);
        // }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        const portfolios = data as Portfolio[];
        setPortfolioItems(portfolios);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(portfolios.map(item => item.category)));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching portfolio items:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [currentLanguage.code]);

  // Filter items when category selection changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredItems(portfolioItems.filter(item => item.category === selectedCategory));
    } else {
      setFilteredItems(portfolioItems);
    }
  }, [selectedCategory, portfolioItems]);

  return (
    <main className="flex-grow">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{t('portfolioTitle')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('portfolioDescription')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                  ? "bg-amber-500 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
            >
              {t('allCategories')}
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                    ? "bg-amber-500 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">{t('errorOccurred')}</h3>
              <p className="text-slate-500">{t('tryAgainLater')}</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square w-full overflow-hidden relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={handleImageError}
                    />
                    <div className="absolute top-3 right-3 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {item.category}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-2">{item.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      to={`/portfolio/${item.id}`}
                      className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                    >
                      {t('viewDetails')} →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                {selectedCategory
                  ? t('noPortfolioItemsInCategory').replace('{category}', selectedCategory)
                  : t('noPortfolioItems')}
              </h3>
              <p className="text-slate-500">{t('checkBackLater')}</p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  {t('viewAllCategories')}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
