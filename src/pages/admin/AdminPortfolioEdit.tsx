/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleEditor } from "@/components/editor";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { Editor } from "@tiptap/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import PortfolioImageManager from "@/components/admin/PortfolioImageManager";

// Define portfolio type
type Portfolio = {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string[];
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
  const { languagesList } = useLanguage();
  const isNewPortfolio = id === "new";

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(PORTFOLIO_CATEGORIES[0]);
  const [images, setImages] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("none");
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
          // Convert from old format to new format if needed
          const rawData = data as any;

          setName(rawData.name);
          setDescription(rawData.description);
          setContent(rawData.content);
          setCategory(rawData.category);

          // Handle both old and new data formats
          if (rawData.images) {
            // New format
            setImages(rawData.images);
          } else if (rawData.image_url) {
            // Old format - convert to new format
            const allImages = [rawData.image_url];
            if (rawData.additional_images && Array.isArray(rawData.additional_images)) {
              allImages.push(...rawData.additional_images);
            }
            setImages(allImages);
          } else {
            // No images
            setImages([]);
          }

          setLanguage(rawData.language || "none");
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
  }, [id]);

  const handleSave = async () => {
    if (!name || !description || images.length === 0 || !category) {
      toast({
        title: t("missingFields"),
        description: t("fillRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Filter out placeholder URLs before saving
      const filteredImages = images.filter(url =>
        !url.startsWith("placeholder-") && url.trim() !== ""
      );

      // For now, we need to maintain backward compatibility with the database schema
      // The first image becomes the main image, the rest become additional_images
      const portfolioData = {
        name,
        description,
        content,
        category,
        image_url: filteredImages.length > 0 ? filteredImages[0] : "",
        additional_images: filteredImages.length > 1 ? filteredImages.slice(1) : null,
        language: language === "none" ? null : language,
      };

      let result: { data: any; error: any };

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
            <PortfolioImageManager
              images={images}
              onImagesChange={setImages}
              bucket="artifacts"
              folder="portfolios"
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
                      <SelectItem value="none">{t("noLanguage")}</SelectItem>
                      {languagesList.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {`${lang.flag} ${lang.name}`}
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
