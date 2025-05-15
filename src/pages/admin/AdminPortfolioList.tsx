import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { handleImageError } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define portfolio type
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

const AdminPortfolioList = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [filteredItems, setFilteredItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .order("created_at", { ascending: false });

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

  useEffect(() => {
    let filtered = [...portfolioItems];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, portfolioItems]);

  const handleDeletePortfolio = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", itemToDelete);

      if (error) throw new Error(error.message);

      // Update the local state
      setPortfolioItems(portfolioItems.filter((item) => item.id !== itemToDelete));
      setFilteredItems(filteredItems.filter((item) => item.id !== itemToDelete));

      toast({
        title: t("portfolioDeleted"),
        description: t("portfolioDeleteSuccess"),
      });
    } catch (err) {
      console.error("Error deleting portfolio:", err);
      toast({
        title: t("errorOccurred"),
        description: err instanceof Error ? err.message : t("unknownError"),
        variant: "destructive",
      });
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("portfolioItems")}</h1>
          <p className="text-gray-500 mt-1">{t("managePortfolioItems")}</p>
        </div>
        <Link to="/admin/portfolio/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("addPortfolioItem")}
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={t("searchPortfolio")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <div className="w-full md:w-48 flex-shrink-0">
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filterByCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-500">{t("loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <div className="text-slate-500">{t("errorOccurred")}</div>
            <p className="text-slate-400 mt-2">{t("tryAgainLater")}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square w-full overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 left-3 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {item.category}
                  </div>
                  {item.language && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {item.language.toUpperCase()}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-2">{item.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/portfolio/${item.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    {t("edit")}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center gap-1"
                        onClick={() => setItemToDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        {t("delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deletePortfolioConfirmation")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>
                          {t("cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeletePortfolio}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {selectedCategory
                ? t("noPortfolioItemsInCategory").replace('{category}', selectedCategory)
                : searchQuery
                  ? t("noSearchResults")
                  : t("noPortfolioItems")}
            </p>
            <div className="mt-4 flex justify-center gap-4">
              {(selectedCategory || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                >
                  {t("clearFilters")}
                </Button>
              )}
              <Link to="/admin/portfolio/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t("addPortfolioItem")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPortfolioList;
