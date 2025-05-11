import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface ArtifactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artifact?: {
    id: string;
    name: string;
    period: string;
    category: string;
    hasModel: boolean;
    description: string;
  };
  onSave: (artifact: {
    name: string;
    period: string;
    category: string;
    hasModel: boolean;
    description: string;
  }) => void;
}

const ArtifactDialog = ({ isOpen, onClose, artifact, onSave }: ArtifactDialogProps) => {
  const [name, setName] = useState(artifact?.name || "");
  const [period, setPeriod] = useState(artifact?.period || "");
  const [category, setCategory] = useState(artifact?.category || "");
  const [hasModel, setHasModel] = useState(artifact?.hasModel || false);
  const [description, setDescription] = useState(artifact?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !period || !category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Here we would normally save to Supabase
    onSave({
      name,
      period,
      category,
      hasModel,
      description: description || "" // Ensure description is never undefined
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{artifact ? "Edit Artifact" : "Create New Artifact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter artifact name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., 5th Century BCE"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Pottery, Jewelry"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasModel" 
                checked={hasModel} 
                onCheckedChange={(checked) => setHasModel(checked === true)}
              />
              <Label htmlFor="hasModel">Has 3D Model</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter artifact description"
                className="h-40"
              />
            </div>
            {/* In a real implementation, we would add file upload fields for images and 3D models */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactDialog;
