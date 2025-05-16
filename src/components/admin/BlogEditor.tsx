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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Check, X, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Define the comment interface
interface Comment {
  id: string;
  text: string;
  isValidated: boolean;
}

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
  comments?: Comment[] | null;
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
  const [activeTab, setActiveTab] = useState("content");
  const [comments, setComments] = useState<Comment[]>([]);


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
      setComments(blog.comments || []);
    }
  }, [blog, currentLanguage.code]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Comment management functions
  const handleToggleCommentValidation = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, isValidated: !comment.isValidated }
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    );
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
      language,
      comments
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
      <div className="space-y-6">
        {/* Title and Author in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Image upload */}
        <div>
          <FileUploadField
            label={t('blogImage')}
            value={image}
            onChange={setImage}
            placeholder={t('enterImageUrlField')}
            accept="image/*"
            maxSizeMB={2}
            bucket="artifacts"
            folder="blog"
            showPreview={true}
            description={t('recommendedImageSize')}
          />
        </div>

        {/* Status and Language in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">{t('status')}</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as 'draft' | 'published')}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    {t('draft')}
                  </div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {t('published')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">{t('language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={t('language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    English
                  </div>
                </SelectItem>
                <SelectItem value="fr">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Français
                  </div>
                </SelectItem>
                <SelectItem value="ar">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    العربية
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
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

        {/* Tabs for Content and Comments */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="content">{t('content')}</TabsTrigger>
            <TabsTrigger value="comments">{t('comments')}</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
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
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('manageComments')}</h3>
                <Badge variant="outline">
                  {comments.length} {t('comments')}
                </Badge>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noCommentsYet')}
                </div>
              ) : (
                <div className="h-[400px] border rounded-md p-4">
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="border rounded-md p-4 relative">
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={comment.isValidated ? "text-green-500" : "text-gray-400"}
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleCommentValidation(comment.id);
                            }}
                            title={comment.isValidated ? t('markAsInvalid') : t('markAsValid')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteComment(comment.id);
                            }}
                            title={t('deleteComment')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mb-2 flex items-center">
                          <Badge variant={comment.isValidated ? "default" : "secondary"} className="mr-2">
                            {comment.isValidated ? t('validated') : t('pendingStatus')}
                          </Badge>
                        </div>

                        <p className="text-sm mt-2">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <Dialog>
        <div className="flex justify-between items-center pt-4 border-t mt-6">
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('previewBlog')}
            </Button>
          </DialogTrigger>

          <div className="flex space-x-4">
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? t('saving') : blog?.id ? t('updateBlog') : t('createBlog')}
            </Button>
          </div>
        </div>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('blogPreview')}</DialogTitle>
            <DialogDescription>
              {t('previewDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Card className="overflow-hidden shadow-md">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
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
                <span className={`absolute bottom-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                  {status === 'published' ? t('published') : t('draft')}
                </span>
                {language && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'العربية'}
                  </span>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1 text-lg">{title || t('blogTitle')}</CardTitle>
                <CardDescription className="flex justify-between text-sm">
                  <span>{t('by')} {author || t('authorName')}</span>
                  <span className="text-slate-500">
                    {new Date().toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-slate-600">{summary || t('blogSummary')}</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default BlogEditor;
