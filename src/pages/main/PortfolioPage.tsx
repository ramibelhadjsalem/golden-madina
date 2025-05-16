import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";
import PortfolioCardCarousel from "@/components/PortfolioCardCarousel";

// Define portfolio item type
type Portfolio = {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  created_at: string;
  language: string | null;

  // Support both old and new formats
  images?: string[];
  image_url?: string;
  additional_images?: string[] | null;
};

const PortfolioPage = () => {
  const { t } = useTranslate();
  const { currentLanguage, languagesList } = useLanguage();
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [filteredItems, setFilteredItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>();

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all portfolio items from Supabase
        const query = supabase
          .from("portfolios")
          .select("*");

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
  }, []);

  // Apply all filters (category, language, search)
  useEffect(() => {
    let filtered = [...portfolioItems];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter(item => item.language === selectedLanguage);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, selectedLanguage, searchQuery, portfolioItems]);

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

      {/* Search and Filters */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          {/* Search Bar and Language Filter */}
          <div className="mb-6 max-w-3xl mx-auto flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={t("searchPortfolio")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white w-full"
              />
            </div>
            <div className="w-full md:w-40 flex-shrink-0">
              <Select
                value={selectedLanguage || "all"}
                onValueChange={(value) => setSelectedLanguage(value === "all" ? null : value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allLanguages")}</SelectItem>
                  {languagesList.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {`${lang.flag} ${lang.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Pills */}
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

          {/* Clear Filters Button */}
          {(selectedCategory || selectedLanguage || searchQuery) && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLanguage(null);
                  setSearchQuery("");
                }}
                className="text-sm text-slate-600 hover:text-amber-600 flex items-center gap-1"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
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
                  <div className="relative">
                    {/* Convert from old format to new format if needed */}
                    <PortfolioCardCarousel
                      images={item.images || (item.image_url ? [item.image_url, ...(item.additional_images || [])] : [])}
                      name={item.name}
                    />
                    <div className="absolute top-3 right-3 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
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
                {searchQuery
                  ? t('noSearchResults')
                  : selectedCategory
                    ? t('noPortfolioItemsInCategory').replace('{category}', selectedCategory)
                    : t('noPortfolioItems')}
              </h3>
              <p className="text-slate-500">{t('checkBackLater')}</p>
              {(selectedCategory || selectedLanguage || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedLanguage(null);
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  {t('clearFilters')}
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
