import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslate } from "@/hooks/use-translate";
import { SendHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define the comment interface
export interface ArtifactComment {
  id: string;
  text: string;
  isValidated: boolean;
}

interface ArtifactCommentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  artifactId: string;
  comments?: ArtifactComment[];
  onCommentsChange?: (comments: ArtifactComment[]) => void;
}

const ArtifactCommentSheet = ({
  isOpen,
  onOpenChange,
  artifactId,
  comments = [],
  onCommentsChange
}: ArtifactCommentSheetProps) => {
  const { t } = useTranslate();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseEnterComment'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmittingComment(true);

      // Create a new comment
      const newComment: ArtifactComment = {
        id: uuidv4(),
        text: commentContent,
        isValidated: false, // Comments need validation by default
      };

      // Get current comments or initialize empty array
      const currentComments = comments || [];

      // Add the new comment
      const updatedComments = [...currentComments, newComment];

      // Update the artifact with the new comment
      const { error } = await supabase
        .from('artifacts')
        .update({ comments: updatedComments })
        .eq('id', artifactId);

      if (error) throw error;

      // Update parent component state if callback provided
      if (onCommentsChange) {
        onCommentsChange(updatedComments);
      }

      // Reset form
      setCommentContent("");

      // Close the comment sheet
      onOpenChange(false);

      // Show success message
      toast({
        title: t('commentSubmitted'),
        description: t('commentAwaitingValidation'),
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: t('error'),
        description: t('failedToSubmitComment'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('artifactLeaveComment')}</SheetTitle>
          <SheetDescription>
            {t('artifactCommentDescription')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-180px)]">
          <div className="flex-grow overflow-auto py-4">
            {/* Validated Comments Section */}
            {comments && comments.filter(c => c.isValidated).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{t('artifactComments')}</h3>
                <ScrollArea className="h-[calc(100%-60px)]">
                  <div className="space-y-6">
                    {comments
                      .filter(comment => comment.isValidated)
                      .map(comment => (
                        <div key={comment.id} className="border-b pb-4 mb-4">
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-auto">
            <div className="space-y-2 mb-4">
              <Label htmlFor="comment">{t('comment')}</Label>
              <Textarea
                id="comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={t('enterYourComment')}
                rows={3}
                required
              />
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">{t('cancel')}</Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmittingComment}>
                {isSubmittingComment ? (
                  t('submitting')
                ) : (
                  <div className="flex items-center gap-2">
                    {t('submitComment')}
                    <SendHorizontal className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ArtifactCommentSheet;
