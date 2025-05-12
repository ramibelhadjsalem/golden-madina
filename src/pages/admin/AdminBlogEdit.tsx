import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor from "@/components/admin/BlogEditor";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";

// Define the blog post interface
interface BlogPost {
  id?: string;
  title: string;
  author: string;
  content: string;
  summary: string;
  image: string;
  status: 'published' | 'draft';
  created_at?: string;
  published_at?: string | null;
  language?: string;
  date?: string;
}

const AdminBlogEdit = () => {
  const { t } = useTranslate();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewBlog = !id || id === "new";

  const [blog, setBlog] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!isNewBlog);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combined loading state for UI
  const isPageLoading = isLoading || isSubmitting;

  // Fetch blog data if editing an existing blog
  useEffect(() => {
    async function fetchBlog() {
      if (isNewBlog) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the blog directly from Supabase
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) throw error;

        if (data) {
          // Transform the data to match the BlogPost interface
          const blogPost: BlogPost = {
            ...data,
            date: data.published_at || data.created_at
          };

          setBlog(blogPost);
        } else {
          toast({
            title: t('error'),
            description: t('blogNotFound'),
            variant: "destructive",
          });
          navigate("/admin/blogs");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast({
          title: t('error'),
          description: t('errorFetchingBlog'),
          variant: "destructive",
        });
        navigate("/admin/blogs");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [id, isNewBlog, navigate, t]);

  const handleSaveBlog = async (blogData: BlogPost) => {
    try {
      setIsSubmitting(true);

      // Prepare the blog data
      const now = new Date().toISOString();
      const isPublished = blogData.status === 'published';

      // Create the blog data object
      const blogToSave = {
        title: blogData.title,
        author: blogData.author,
        content: blogData.content,
        summary: blogData.summary,
        image: blogData.image,
        status: blogData.status,
        language: blogData.language,
        // Set published_at if status is published
        published_at: isPublished ? (blogData.published_at || now) : null
      };

      let result: BlogPost | null = null;

      if (id && id !== "new") {
        // Update existing blog
        const { data, error } = await supabase
          .from('blogs')
          .update(blogToSave)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert([{
            ...blogToSave,
            created_at: now
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      if (result) {
        // Show success message
        toast({
          title: id && id !== "new" ? t('blogUpdated') : t('blogCreated'),
          description: id && id !== "new" ? t('blogUpdateSuccess') : t('blogCreateSuccess'),
        });

        // Navigate back to blog list
        navigate("/admin/blogs");
      } else {
        throw new Error("Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: t('error'),
        description: t('errorSavingBlog'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/blogs");
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {id && id !== "new" ? t('editBlog') : t('createNewBlog')}
        </h1>
        <p className="text-gray-500 mt-1">
          {id && id !== "new" ? t('editBlogDescription') : t('createBlogDescription')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <BlogEditor
          blog={blog}
          onSave={handleSaveBlog}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default AdminBlogEdit;
