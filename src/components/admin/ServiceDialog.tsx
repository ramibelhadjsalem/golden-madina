import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service?: {
    id: string;
    name: string;
    duration: string;
    price: string;
    description: string;
  };
  onSave: (service: {
    name: string;
    duration: string;
    price: string;
    description: string;
  }) => void;
}

const ServiceDialog = ({ isOpen, onClose, service, onSave }: ServiceDialogProps) => {
  const [name, setName] = useState(service?.name || "");
  const [duration, setDuration] = useState(service?.duration || "");
  const [price, setPrice] = useState(service?.price || "");
  const [description, setDescription] = useState(service?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration || !price) {
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
      duration,
      price,
      description: description || "" // Ensure description is never undefined
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Create New Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 90 minutes, 2 hours"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., $20, $45 per person"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter service description"
                className="h-40"
              />
            </div>
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

export default ServiceDialog;
