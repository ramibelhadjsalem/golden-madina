import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useTranslate } from "@/hooks/use-translate";
import PortfolioCardCarousel from "@/components/PortfolioCardCarousel";

// Define portfolio type
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

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPortfolio(data as Portfolio);
        } else {
          // No portfolio found with this ID
          navigate('/404');
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-32" />
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

  // Redirect to 404 if portfolio is not found (this is a fallback, should be handled by the useEffect)
  if (!portfolio) {
    navigate('/404');
    return null;
  }

  // Get all images from either the new or old format
  const allImages = portfolio.images ||
    (portfolio.image_url ? [portfolio.image_url, ...(portfolio.additional_images || [])] : []);

  return (
    <main className="flex-grow py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/portfolio" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
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
            {t('backToPortfolio')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
              <PortfolioCardCarousel
                images={allImages}
                name={portfolio.name}
                className="aspect-square"
              />
            </div>
          </div>

          {/* Right: Portfolio Details */}
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{portfolio.name}</h1>
            <p className="text-slate-500 mb-4">
              <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                {portfolio.category}
              </span>
            </p>
            <p className="text-slate-600 mb-6">{portfolio.description}</p>

            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: portfolio.content }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PortfolioDetail;
