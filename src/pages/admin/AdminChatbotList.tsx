import { useState, useEffect } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { useChatbotResponses, useChatbotResponsesAdmin, ChatbotResponse } from "@/hooks/use-chatbot-responses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { setDocumentTitle } from "@/lib/document-utils";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

const AdminChatbotList = () => {
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const { responses, loading, error, refetch } = useChatbotResponses();
  const { createResponse, updateResponse, deleteResponse } = useChatbotResponsesAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [intentFilter, setIntentFilter] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<ChatbotResponse | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    intent: "",
    pattern: [""], // Array of patterns
    response_en: "",
    response_fr: "",
    response_ar: "",
    priority: 0,
    is_active: true
  });

  // State for managing patterns in the form
  const [patternInput, setPatternInput] = useState("");

  // Set document title
  useEffect(() => {
    setDocumentTitle(t('manageChatbotResponses'));
  }, [t]);

  // Get unique intents for filtering
  const uniqueIntents = [...new Set(responses.map(r => r.intent))].sort();

  // Filter responses based on search term and intent filter
  const filteredResponses = responses.filter(response => {
    const matchesSearch = searchTerm === "" ||
      // Check if any pattern includes the search term
      response.pattern.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      response.response_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (response.response_fr && response.response_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (response.response_ar && response.response_ar.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIntent = intentFilter === null || response.intent === intentFilter;

    return matchesSearch && matchesIntent;
  });

  // Handle opening the edit dialog
  const handleEditClick = (response: ChatbotResponse) => {
    setCurrentResponse(response);
    setFormData({
      intent: response.intent,
      pattern: response.pattern,
      response_en: response.response_en,
      response_fr: response.response_fr || "",
      response_ar: response.response_ar || "",
      priority: response.priority,
      is_active: response.is_active
    });
    setIsEditDialogOpen(true);
  };

  // Handle opening the delete dialog
  const handleDeleteClick = (response: ChatbotResponse) => {
    setCurrentResponse(response);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  // Handle adding a pattern
  const handleAddPattern = () => {
    if (patternInput.trim() === "") return;

    setFormData(prev => ({
      ...prev,
      pattern: [...prev.pattern, patternInput.trim()]
    }));
    setPatternInput("");
  };

  // Handle removing a pattern
  const handleRemovePattern = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pattern: prev.pattern.filter((_, i) => i !== index)
    }));
  };

  // Handle creating a new response
  const handleCreateResponse = async () => {
    // Validate that we have at least one pattern
    if (formData.pattern.length === 0 || (formData.pattern.length === 1 && formData.pattern[0] === "")) {
      toast({
        title: t('error'),
        description: t('errorAtLeastOnePattern'),
        variant: 'destructive',
      });
      return;
    }

    // Filter out empty patterns
    const cleanedPatterns = formData.pattern.filter(p => p.trim() !== "");

    // Convert priority to number
    const formDataWithNumberPriority = {
      ...formData,
      pattern: cleanedPatterns,
      priority: Number(formData.priority)
    };

    await createResponse(formDataWithNumberPriority);
    setIsCreateDialogOpen(false);
    refetch();
  };

  // Handle updating a response
  const handleUpdateResponse = async () => {
    if (!currentResponse) return;

    // Validate that we have at least one pattern
    if (formData.pattern.length === 0 || (formData.pattern.length === 1 && formData.pattern[0] === "")) {
      toast({
        title: t('error'),
        description: t('errorAtLeastOnePattern'),
        variant: 'destructive',
      });
      return;
    }

    // Filter out empty patterns
    const cleanedPatterns = formData.pattern.filter(p => p.trim() !== "");

    // Convert priority to number
    const formDataWithNumberPriority = {
      ...formData,
      pattern: cleanedPatterns,
      priority: Number(formData.priority)
    };

    await updateResponse(currentResponse.id, formDataWithNumberPriority);
    setIsEditDialogOpen(false);
    refetch();
  };

  // Handle deleting a response
  const handleDeleteResponse = async () => {
    if (!currentResponse) return;

    await deleteResponse(currentResponse.id);
    setIsDeleteDialogOpen(false);
    refetch();
  };

  // Reset form data for create dialog
  const handleOpenCreateDialog = () => {
    setFormData({
      intent: "",
      pattern: [""], // Start with one empty pattern
      response_en: "",
      response_fr: "",
      response_ar: "",
      priority: 0,
      is_active: true
    });
    setPatternInput("");
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('manageChatbotResponses')}</h1>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addChatbotResponse')}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={t('searchResponses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <Select value={intentFilter || "all"} onValueChange={(value) => setIntentFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('filterByIntent')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allIntents')}</SelectItem>
            {uniqueIntents.map((intent) => (
              <SelectItem key={intent} value={intent}>{intent}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Responses List */}
      {loading ? (
        <div className="text-center py-8">{t('loading')}</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{t('errorLoadingResponses')}</div>
      ) : filteredResponses.length === 0 ? (
        <div className="text-center py-8">{t('noResponsesFound')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResponses.map((response) => (
            <Card key={response.id} className={response.is_active ? "" : "opacity-60"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{response.intent}</CardTitle>
                    <CardDescription className="mt-1">
                      {t('patterns')}:
                      <div className="flex flex-wrap gap-1 mt-1">
                        {response.pattern.map((p, index) => (
                          <code key={index} className="bg-gray-100 px-1 rounded text-xs">{p}</code>
                        ))}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(response)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(response)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="en">
                  <TabsList className="mb-2">
                    <TabsTrigger value="en">🇺🇸</TabsTrigger>
                    <TabsTrigger value="fr">🇫🇷</TabsTrigger>
                    <TabsTrigger value="ar">🇸🇦</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="mt-0">
                    <p className="text-sm">{response.response_en}</p>
                  </TabsContent>
                  <TabsContent value="fr" className="mt-0">
                    <p className="text-sm">{response.response_fr || t('noTranslation')}</p>
                  </TabsContent>
                  <TabsContent value="ar" className="mt-0">
                    <p className="text-sm text-right" dir="rtl">{response.response_ar || t('noTranslation')}</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <div className="text-sm text-gray-500">
                  {t('priority')}: {response.priority}
                </div>
                <div className="text-sm text-gray-500">
                  {response.is_active ? t('active') : t('inactive')}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('addChatbotResponse')}</DialogTitle>
            <DialogDescription>{t('addChatbotResponseDescription')}</DialogDescription>
          </DialogHeader>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="intent">{t('intent')}</Label>
              <Input
                id="intent"
                name="intent"
                value={formData.intent}
                onChange={handleInputChange}
                placeholder={t('enterIntent')}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="patterns">{t('patterns')}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.pattern.map((p, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                    <span className="text-sm">{p}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => handleRemovePattern(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="patternInput"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  placeholder={t('enterPattern')}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPattern())}
                />
                <Button
                  type="button"
                  onClick={handleAddPattern}
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  {t('addPattern')}
                </Button>
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="response_en">{t('responseEn')}</Label>
              <Textarea
                id="response_en"
                name="response_en"
                value={formData.response_en}
                onChange={handleInputChange}
                placeholder={t('enterResponseEn')}
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="response_fr">{t('responseFr')}</Label>
              <Textarea
                id="response_fr"
                name="response_fr"
                value={formData.response_fr}
                onChange={handleInputChange}
                placeholder={t('enterResponseFr')}
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="response_ar">{t('responseAr')}</Label>
              <Textarea
                id="response_ar"
                name="response_ar"
                value={formData.response_ar}
                onChange={handleInputChange}
                placeholder={t('enterResponseAr')}
                rows={3}
                dir={currentLanguage.rtl ? "rtl" : "ltr"}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="priority">{t('priority')}</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
                placeholder={t('enterPriority')}
              />
            </div>

            <div className="col-span-1 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_active">{t('active')}</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateResponse}>
              {t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editChatbotResponse')}</DialogTitle>
            <DialogDescription>{t('editChatbotResponseDescription')}</DialogDescription>
          </DialogHeader>

          {/* Form - Same as create dialog */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="edit_intent">{t('intent')}</Label>
              <Input
                id="edit_intent"
                name="intent"
                value={formData.intent}
                onChange={handleInputChange}
                placeholder={t('enterIntent')}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit_patterns">{t('patterns')}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.pattern.map((p, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                    <span className="text-sm">{p}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => handleRemovePattern(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="edit_patternInput"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  placeholder={t('enterPattern')}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPattern())}
                />
                <Button
                  type="button"
                  onClick={handleAddPattern}
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  {t('addPattern')}
                </Button>
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit_response_en">{t('responseEn')}</Label>
              <Textarea
                id="edit_response_en"
                name="response_en"
                value={formData.response_en}
                onChange={handleInputChange}
                placeholder={t('enterResponseEn')}
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit_response_fr">{t('responseFr')}</Label>
              <Textarea
                id="edit_response_fr"
                name="response_fr"
                value={formData.response_fr}
                onChange={handleInputChange}
                placeholder={t('enterResponseFr')}
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit_response_ar">{t('responseAr')}</Label>
              <Textarea
                id="edit_response_ar"
                name="response_ar"
                value={formData.response_ar}
                onChange={handleInputChange}
                placeholder={t('enterResponseAr')}
                rows={3}
                dir={currentLanguage.rtl ? "rtl" : "ltr"}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="edit_priority">{t('priority')}</Label>
              <Input
                id="edit_priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
                placeholder={t('enterPriority')}
              />
            </div>

            <div className="col-span-1 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit_is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="edit_is_active">{t('active')}</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleUpdateResponse}>
              {t('update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteChatbotResponse')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteChatbotResponseConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResponse} className="bg-red-500 hover:bg-red-600">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminChatbotList;
