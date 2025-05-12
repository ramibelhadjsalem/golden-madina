import { useState, useEffect } from "react";
import { SimpleEditor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { toast } from "@/hooks/use-toast";
import { Editor } from "@tiptap/react";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";

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

// Simple component to preview files
const FilePreview = ({ url, width, height, alt, className }: {
  url: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
        Image not found
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt || "Preview"}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
};

interface BlogEditorProps {
  blog?: BlogPost;
  onSave: (blogData: BlogPost) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blog, onSave, onCancel }) => {
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [language, setLanguage] = useState(currentLanguage.code);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with blog data if editing
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setAuthor(blog.author || "");
      setSummary(blog.summary || "");
      setContent(blog.content || "");
      setImage(blog.image || "");
      setStatus(blog.status || 'draft');
      setLanguage(blog.language || currentLanguage.code);
    }
  }, [blog, currentLanguage.code]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      toast({
        title: t('error'),
        description: t('titleRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!author.trim()) {
      toast({
        title: t('error'),
        description: t('authorRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!summary.trim()) {
      toast({
        title: t('error'),
        description: t('summaryRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: t('error'),
        description: t('contentRequired'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Prepare blog data
    const blogData: BlogPost = {
      id: blog?.id,
      title,
      author,
      date: blog?.date || new Date().toISOString().split('T')[0],
      summary,
      content,
      image,
      status,
      language
    };

    // Save blog
    try {
      onSave(blogData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTitle')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="author">{t('author')}</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t('enterAuthor')}
              className="mt-1"
            />
          </div>

          <div>
            <FileUploadField
              label={t('blogImage')}
              value={image}
              onChange={setImage}
              placeholder={t('enterImageUrl')}
              accept="image/*"
              maxSizeMB={2}
              bucket="blogs"
              folder="covers"
              showPreview={false}
              description={t('recommendedImageSize')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t('status')}</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">{t('draft')}</option>
                <option value="published">{t('published')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="summary">{t('summary')}</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t('enterSummary')}
              className="mt-1 h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>{t('imagePreview')}</Label>
            <div className="mt-1 border border-gray-200 rounded-md overflow-hidden h-48 bg-gray-50">
              {image ? (
                <FilePreview
                  url={image}
                  width="100%"
                  height="100%"
                  alt={title || t('blogImagePreview')}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  {t('noImageSelected')}
                </div>
              )}
            </div>
          </div>

          <div className={!image ? "mt-8" : ""}>
            <Label>{t('blogPreview')}</Label>
            <div className="mt-1 p-4 border border-gray-200 rounded-md bg-white">
              <h2 className="text-xl font-bold">{title || t('blogTitle')}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {t('by')} {author || t('authorName')}
              </p>
              <p className="mt-2 text-gray-700">{summary || t('blogSummary')}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="content">{t('content')}</Label>
        <div className="mt-1">
          <SimpleEditor
            initContent={content}
            onChange={handleContentChange}
            setEditor={setEditor}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('saving') : blog?.id ? t('updateBlog') : t('createBlog')}
        </Button>
      </div>
    </form>
  );
};

export default BlogEditor;
