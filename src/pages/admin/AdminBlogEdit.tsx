import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor from "@/components/admin/BlogEditor";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { BlogPost, getBlogById, createBlog, updateBlog } from "@/hooks/use-blogs-fixed";



const AdminBlogEdit = () => {
  const { t } = useTranslate();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch blog data if editing an existing blog
    async function fetchBlog() {
      if (id && id !== "new") {
        try {
          const fetchedBlog = await getBlogById(id);

          if (fetchedBlog) {
            setBlog(fetchedBlog);
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
        }
      }

      setIsLoading(false);
    }

    fetchBlog();
  }, [id, navigate, t]);

  const handleSaveBlog = async (blogData: BlogPost) => {
    try {
      setIsLoading(true);

      let result: BlogPost | null;

      if (id && id !== "new") {
        // Update existing blog
        result = await updateBlog(id, blogData);
      } else {
        // Create new blog
        result = await createBlog(blogData);
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
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/blogs");
  };

  if (isLoading) {
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
