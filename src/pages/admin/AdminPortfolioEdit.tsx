import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleEditor } from "@/components/editor";
import { FileUploadField } from "@/components/ui/file-upload-field";

import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { Editor } from "@tiptap/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import ImageGalleryManager from "@/components/admin/ImageGalleryManager";

// Define portfolio type
type Portfolio = {
  id: string;
  name: string;
  description: string;
  content: string;
  image_url: string;
  additional_images: string[] | null;
  category: string;
  created_at: string;
  language: string | null;
};

// Predefined categories
const PORTFOLIO_CATEGORIES = [
  "Exhibitions",
  "Restorations",
  "Workshops",
  "Events",
  "Publications",
  "Research",
  "Collaborations",
  "Other"
];

const AdminPortfolioEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { currentLanguage, languagesList } = useLanguage();
  const isNewPortfolio = id === "new";

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(PORTFOLIO_CATEGORIES[0]);
  const [mainImage, setMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [language, setLanguage] = useState(currentLanguage.code);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNewPortfolio);

  useEffect(() => {
    if (isNewPortfolio) {
      setIsLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          const portfolio = data as Portfolio;
          setName(portfolio.name);
          setDescription(portfolio.description);
          setContent(portfolio.content);
          setCategory(portfolio.category);
          setMainImage(portfolio.image_url);
          setAdditionalImages(portfolio.additional_images || []);
          setLanguage(portfolio.language || currentLanguage.code);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        toast({
          title: t("errorOccurred"),
          description: t("couldNotLoadPortfolio"),
          variant: "destructive",
        });
        navigate("/admin/portfolio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [id, isNewPortfolio, navigate, t, currentLanguage.code]);

  const handleSave = async () => {
    if (!name || !description || !mainImage || !category) {
      toast({
        title: t("missingFields"),
        description: t("fillRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const portfolioData = {
        name,
        description,
        content,
        category,
        image_url: mainImage,
        additional_images: additionalImages.length > 0 ? additionalImages : null,
        language: language || null,
      };

      let result;

      if (isNewPortfolio) {
        result = await supabase
          .from("portfolios")
          .insert(portfolioData)
          .select()
          .single();
      } else {
        result = await supabase
          .from("portfolios")
          .update(portfolioData)
          .eq("id", id)
          .select()
          .single();
      }

      const { error } = result;

      if (error) throw error;

      toast({
        title: isNewPortfolio ? t("portfolioCreated") : t("portfolioUpdated"),
        description: isNewPortfolio ? t("portfolioCreateSuccess") : t("portfolioUpdateSuccess"),
      });

      if (isNewPortfolio) {
        navigate("/admin/portfolio");
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast({
        title: t("errorOccurred"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/portfolio");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isNewPortfolio ? t("createPortfolio") : t("editPortfolio")}
          </h1>
          <p className="text-gray-500 mt-1">
            {isNewPortfolio ? t("createPortfolioDescription") : t("editPortfolioDescription")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ImageGalleryManager
              mainImage={mainImage}
              additionalImages={additionalImages}
              onMainImageChange={setMainImage}
              onAdditionalImagesChange={setAdditionalImages}
              bucket="portfolios"
              folder="images"
            />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("enterPortfolioName")}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">{t("category")}</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTFOLIO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">{t("language")}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue placeholder={t("selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {languagesList.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("enterDescription")}
                  className="mt-1 h-24"
                />
              </div>

              <div>
                <Label htmlFor="content">{t("content")}</Label>
                <div className="mt-1">
                  <SimpleEditor
                    initContent={content}
                    onChange={setContent}
                    setEditor={setEditor}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPortfolioEdit;
