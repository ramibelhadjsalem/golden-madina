
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

// Define the blog post interface
interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  summary: string;
  image: string;
  status: 'published' | 'draft';
  created_at: string;
  published_at: string | null;
  language?: string;
  date: string;
}

const BlogDetail = () => {
  const { t } = useTranslate();
  const { languagesList } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch blog data
  useEffect(() => {
    // Create a mounted flag to prevent state updates after unmounting
    let isMounted = true;

    async function fetchBlog() {
      if (!id) {
        navigate("/not-found", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching blog with ID: ${id}`);

        // Fetch the blog directly from Supabase
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();

        // Check if component is still mounted
        if (!isMounted) return;

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (data) {
          console.log("Blog data received:", data);

          // Transform the data to match the BlogPost interface
          const blogPost: BlogPost = {
            ...data,
            date: data.published_at || data.created_at
          };

          setBlog(blogPost);
        } else {
          console.log("No blog found with ID:", id);
          navigate("/not-found", { replace: true });
        }
      } catch (err) {
        // Check if component is still mounted
        if (!isMounted) return;

        console.error("Error fetching blog:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        // Check if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBlog();

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  return (
    <main className="flex-grow">
      {loading ? (
        // Loading skeleton
        <div>
          {/* Hero Image Skeleton */}
          <div className="w-full h-[40vh] bg-slate-200 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="h-8 bg-slate-200 animate-pulse mb-4 w-3/4"></div>
              <div className="h-4 bg-slate-200 animate-pulse mb-8 w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 animate-pulse w-5/6"></div>
                <div className="h-4 bg-slate-200 animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 animate-pulse w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('errorOccurred')}</h2>
          <p className="mb-6">{t('tryAgainLater')}</p>
          <Link to="/blog">
            <Button variant="outline">
              ← {t('backToAllArticles')}
            </Button>
          </Link>
        </div>
      ) : blog ? (
        // Blog content
        <>
          {/* Hero Image */}
          <div className="w-full h-[40vh] relative">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{blog.title}</h1>
                <p className="text-white text-opacity-90 mt-2">
                  {t('by')} {blog.author} • {new Date(blog.date).toLocaleDateString(
                    blog.language === 'ar' ? 'ar-SA' : blog.language === 'fr' ? 'fr-FR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
                {blog.language && (
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                    {languagesList.find(lang => lang.code === blog.language)?.name || blog.language.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div
                className="rich-text-content prose prose-slate lg:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Navigation */}
            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200">
              <div className="flex flex-wrap justify-between gap-4">
                <Link to="/blog">
                  <Button variant="outline">
                    ← {t('backToAllArticles')}
                  </Button>
                </Link>
                <Link to="/">
                  <Button>
                    {t('exploreMore')}
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </>
      ) : (
        // No blog found
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('blogNotFound')}</h2>
          <p className="mb-6">{t('blogMayHaveBeenRemoved')}</p>
          <Link to="/blog">
            <Button variant="outline">
              ← {t('backToAllArticles')}
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
};

export default BlogDetail;
