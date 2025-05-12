
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

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

const AdminBlogList = () => {
  const { t } = useTranslate();
  const { languagesList } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

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

  // Fetch blogs function
  const fetchBlogs = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      setError(null);

      // Start with a simple query
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!isMounted.current) return;

      // Filter the data in JavaScript to avoid type instantiation issues
      let filteredData = data || [];

      // Apply status filter if not 'all'
      if (selectedStatus !== 'all') {
        filteredData = filteredData.filter(blog => blog.status === selectedStatus);
      }

      // Apply language filter if not 'all'
      if (selectedLanguage !== 'all') {
        filteredData = filteredData.filter(blog => {
          // Type assertion to handle optional language property
          const typedBlog = blog as { language?: string };
          return typedBlog.language === selectedLanguage;
        });
      }

      // Apply search filter if term is long enough
      if (debouncedSearchTerm.length > 2) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        filteredData = filteredData.filter(blog =>
        (blog.title?.toLowerCase().includes(searchLower) ||
          blog.summary?.toLowerCase().includes(searchLower))
        );
      }

      // Transform the data to match the BlogPost interface
      const transformedData = filteredData.map(blog => ({
        ...blog,
        date: blog.published_at || blog.created_at
      }));

      if (isMounted.current) {
        setBlogs(transformedData);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [selectedLanguage, selectedStatus, debouncedSearchTerm]);

  // Fetch blogs when filters change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      setIsDeleting(true);
      try {
        // Delete the blog directly from Supabase
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', blogToDelete);

        if (error) throw error;

        // Show success message
        toast({
          title: t('blogDeleted'),
          description: t('blogDeleteSuccess'),
        });

        // Update the blogs list by removing the deleted blog
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogToDelete));
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast({
          title: t('error'),
          description: t('errorDeletingBlog'),
          variant: 'destructive',
        });
      } finally {
        setIsDeleteAlertOpen(false);
        setBlogToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-64 md:w-96">
            <div className="relative">
              <Input
                placeholder={t('searchBlogs')}
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
            onClick={() => navigate('/admin/blogs/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('newBlogPost')}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center mb-3">
            <Filter className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{t('filters')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">{t('status')}</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as 'all' | 'published' | 'draft')}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                      {t('allStatus')}
                    </div>
                  </SelectItem>
                  <SelectItem value="published">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      {t('published')}
                    </div>
                  </SelectItem>
                  <SelectItem value="draft">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      {t('draft')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">{t('language')}</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                      {t('allLanguages')}
                    </div>
                  </SelectItem>
                  {languagesList.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-xs font-medium text-slate-500">{t('activeFilters')}</label>
              <div className="flex flex-wrap gap-2">
                {selectedStatus !== 'all' && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800">
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${selectedStatus === 'published' ? 'bg-green-500' : 'bg-amber-500'
                      }`}></span>
                    {selectedStatus === 'published' ? t('published') : t('draft')}
                    <button
                      className="ml-1.5 text-slate-500 hover:text-slate-700"
                      onClick={() => setSelectedStatus('all')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                {selectedLanguage !== 'all' && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                    {languagesList.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
                    <button
                      className="ml-1.5 text-slate-500 hover:text-slate-700"
                      onClick={() => setSelectedLanguage('all')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                {debouncedSearchTerm.length > 2 && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
                    {`"${debouncedSearchTerm}"`}
                    <button
                      className="ml-1.5 text-slate-500 hover:text-slate-700"
                      onClick={() => setSearchTerm("")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                {(selectedStatus === 'all' && selectedLanguage === 'all' && debouncedSearchTerm.length <= 2) && (
                  <div className="text-sm text-slate-500 italic">
                    {t('noActiveFilters')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid card layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <div className="text-slate-500">{t('errorOccurred')}</div>
          <p className="text-slate-400 mt-2">{t('tryAgainLater')}</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog: BlogPost) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t('edit')}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(blog.id as string)}
                    className="rounded-full bg-white/80 backdrop-blur-sm text-red-600 hover:bg-white hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t('delete')}</span>
                  </Button>
                </div>
                <span className={`absolute bottom-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
                  }`}>
                  {blog.status === 'published' ? t('published') : t('draft')}
                </span>
                {blog.language && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {languagesList.find(lang => lang.code === blog.language)?.name || blog.language.toUpperCase()}
                  </span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{blog.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <span>{t('by')} {blog.author}</span>
                  <span className="text-slate-500">
                    {new Date(blog.date).toLocaleDateString(
                      blog.language === 'ar' ? 'ar-SA' : blog.language === 'fr' ? 'fr-FR' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-2">{blog.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blogs/${blog.id}`)}>
                  <Pencil className="h-4 w-4 mr-2" /> {t('edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(blog.id as string)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> {t('delete')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <div className="text-slate-500">{t('noBlogsFound')}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/blogs/new')}
            className="mt-3"
          >
            {t('createNewBlogPost')}
          </Button>
        </div>
      )}



      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteBlog')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteWarning')}
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

export default AdminBlogList;
