import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor from "@/components/admin/BlogEditor";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);

  // Combined loading state for UI
  const isPageLoading = isLoading || isSubmitting;

  // Reset the fetch flag when the ID changes
  useEffect(() => {
    console.log(`Resetting hasFetched for blog ID: ${id}`);
    hasFetchedRef.current = false;

    // Cleanup when component unmounts
    return () => {
      console.log(`Cleanup: Resetting hasFetched for blog ID: ${id}`);
      hasFetchedRef.current = false;
    };
  }, [id]);

  // Fetch blog data if editing an existing blog
  useEffect(() => {
    // Skip if we've already fetched this blog or if it's a new blog
    if (hasFetchedRef.current || isNewBlog) {
      console.log(`Skipping fetch for blog ID: ${id}, hasFetched: ${hasFetchedRef.current}, isNewBlog: ${isNewBlog}`);
      if (isNewBlog) {
        setIsLoading(false);
      }
      return;
    }

    console.log(`Starting fetch for blog ID: ${id}, hasFetched: ${hasFetchedRef.current}`);

    // Create a mounted flag to prevent state updates after unmounting
    let isMounted = true;

    async function fetchBlog() {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`Admin: Fetching blog with ID: ${id}`);

        // Fetch the blog directly from Supabase
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id as string)
          .single();

        // Check if component is still mounted
        if (!isMounted) return;

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (data) {
          console.log("Admin: Blog data received:", data);
          hasFetchedRef.current = true;
          console.log(`Set hasFetched to true for blog ID: ${id}`);

          // Transform the data to match the BlogPost interface
          const blogPost: BlogPost = {
            ...data,
            date: data.published_at || data.created_at
          };

          setBlog(blogPost);
        } else {
          console.log("Admin: No blog found with ID:", id);
          toast({
            title: t('error'),
            description: t('blogNotFound'),
            variant: "destructive",
          });
          navigate("/admin/blogs");
        }
      } catch (err) {
        // Check if component is still mounted
        if (!isMounted) return;

        console.error("Error fetching blog:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast({
          title: t('error'),
          description: t('errorFetchingBlog'),
          variant: "destructive",
        });
        navigate("/admin/blogs");
      } finally {
        // Check if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBlog();

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [id, isNewBlog, navigate, t]);

  const handleSaveBlog = async (blogData: BlogPost) => {
    // Create a mounted flag to prevent state updates after unmounting
    let isMounted = true;

    try {
      setIsSubmitting(true);
      console.log("Saving blog:", blogData);

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
        console.log(`Updating existing blog with ID: ${id}`);

        // Update existing blog
        const { data, error } = await supabase
          .from('blogs')
          .update(blogToSave)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error("Error updating blog:", error);
          throw error;
        }

        console.log("Blog updated successfully:", data);
        result = data;
      } else {
        console.log("Creating new blog");

        // Create new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert([{
            ...blogToSave,
            created_at: now
          }])
          .select()
          .single();

        if (error) {
          console.error("Error creating blog:", error);
          throw error;
        }

        console.log("Blog created successfully:", data);
        result = data;
      }

      if (!isMounted) return;

      if (result) {
        // Reset the fetch flag
        console.log(`Save success: Resetting hasFetched for blog ID: ${id}`);
        hasFetchedRef.current = false;

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
      if (!isMounted) return;

      console.error("Error saving blog:", error);
      toast({
        title: t('error'),
        description: t('errorSavingBlog'),
        variant: "destructive",
      });
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }

      // Cleanup function
      isMounted = false;
    }
  };

  const handleCancel = () => {
    navigate("/admin/blogs");
  };

  if (isPageLoading) {
    return (
      <div className="flex flex-col space-y-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-slate-200 animate-pulse mb-2 w-1/3 rounded"></div>
          <div className="h-4 bg-slate-200 animate-pulse w-2/3 rounded"></div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 animate-pulse w-1/6 rounded"></div>
              <div className="h-10 bg-slate-200 animate-pulse w-full rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 animate-pulse w-1/6 rounded"></div>
              <div className="h-10 bg-slate-200 animate-pulse w-full rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 animate-pulse w-1/6 rounded"></div>
              <div className="h-10 bg-slate-200 animate-pulse w-full rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 animate-pulse w-1/6 rounded"></div>
              <div className="h-32 bg-slate-200 animate-pulse w-full rounded"></div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <div className="h-10 bg-slate-200 animate-pulse w-24 rounded"></div>
              <div className="h-10 bg-slate-200 animate-pulse w-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isNewBlog) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-red-600 mb-2">{t('errorOccurred')}</h2>
        <p className="text-red-700 mb-4">{error.message || t('errorFetchingBlog')}</p>
        <Button variant="outline" onClick={() => navigate("/admin/blogs")}>
          ← {t('backToBlogList')}
        </Button>
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
