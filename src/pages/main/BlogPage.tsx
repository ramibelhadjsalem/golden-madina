
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
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

// Define a type for the raw database row
interface BlogRow {
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
  [key: string]: unknown; // Allow for additional properties
}

// Blog card skeleton for loading state
const BlogCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="aspect-video w-full overflow-hidden bg-slate-200 animate-pulse" />
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

const BlogPage = () => {
  const { t } = useTranslate();
  const { currentLanguage, languagesList } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage.code);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch blogs when filters change
  useEffect(() => {
    // Define the fetch function inside the effect to avoid dependency issues
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);

        // Start with a simple query
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;

        // Filter the data in JavaScript to avoid type instantiation issues
        let filteredData = data || [];

        // Apply language filter if not 'all'
        if (selectedLanguage !== 'all') {
          filteredData = filteredData.filter(blog => {
            // Cast to BlogRow which has the language property defined
            return (blog as BlogRow).language === selectedLanguage;
          });
        }

        // Apply search filter if term is long enough
        if (searchTerm.length > 2) {
          const searchLower = searchTerm.toLowerCase();
          filteredData = filteredData.filter(blog => {
            const title = blog.title || '';
            const summary = blog.summary || '';
            return title.toLowerCase().includes(searchLower) ||
              summary.toLowerCase().includes(searchLower);
          });
        }

        // Transform the data to match the BlogPost interface
        const transformedData = filteredData.map(blog => {
          // Cast to BlogRow to access the properties safely
          const typedBlog = blog as BlogRow;
          return {
            ...typedBlog,
            date: typedBlog.published_at || typedBlog.created_at
          } as BlogPost;
        });

        setBlogs(transformedData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [selectedLanguage, searchTerm]);

  // Update selected language when current language changes
  useEffect(() => {
    setSelectedLanguage(currentLanguage.code);
  }, [currentLanguage.code]);

  return (
    <main className="flex-grow">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Heritage Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore stories, research, and insights from our collection and conservation efforts.
          </p>
        </div>
      </section>

      {/* Search & Blog List */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {/* Search and Language Filter */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t('searchArticles')}
                className="w-full p-4 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Language Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedLanguage === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage('all')}
                className="rounded-full"
              >
                {t('allLanguages')}
              </Button>
              {languagesList.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className="rounded-full"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-slate-700">{t('errorOccurred')}</h3>
              <p className="text-slate-500 mt-2">{t('tryAgainLater')}</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{blog.title}</CardTitle>
                    <CardDescription>
                      {t('by')} {blog.author} • {new Date(blog.date).toLocaleDateString(
                        blog.language === 'ar' ? 'ar-SA' : blog.language === 'fr' ? 'fr-FR' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{blog.summary}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                    >
                      {t('readMore')} →
                    </Link>
                    {blog.language && blog.language !== currentLanguage.code && (
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                        {languagesList.find(lang => lang.code === blog.language)?.name || blog.language.toUpperCase()}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-slate-700">{t('noArticlesFound')}</h3>
              <p className="text-slate-500 mt-2">{t('tryAdjustingSearchCriteria')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
