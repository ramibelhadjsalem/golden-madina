
import { useState, useMemo } from "react";
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
import { useBlogs, deleteBlog } from "@/hooks/use-blogs-fixed";

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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create memoized filters object to prevent infinite re-renders
  const filters = useMemo(() => ({
    language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    searchQuery: searchTerm.length > 2 ? searchTerm : undefined,
    orderBy: { column: 'created_at', ascending: false }
  }), [selectedLanguage, selectedStatus, searchTerm]);

  // Fetch blogs from Supabase with filters
  const { blogs, loading, error } = useBlogs(filters);

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      setIsDeleting(true);
      try {
        const success = await deleteBlog(blogToDelete);
        if (success) {
          toast({
            title: t('blogDeleted'),
            description: t('blogDeleteSuccess'),
          });
        } else {
          throw new Error('Failed to delete blog');
        }
      } catch (error) {
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
            <Input
              placeholder={t('searchBlogs')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
          </div>
          <Button className="w-full sm:w-auto" onClick={() => navigate('/admin/blogs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('newBlogPost')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 mr-2">{t('filters')}:</span>
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'all' | 'published' | 'draft')}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatus')}</SelectItem>
              <SelectItem value="published">{t('published')}</SelectItem>
              <SelectItem value="draft">{t('draft')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Language Filter */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allLanguages')}</SelectItem>
              {languagesList.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {blogs.map((blog) => (
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
