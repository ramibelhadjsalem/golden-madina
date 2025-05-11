
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: {
    id: string;
    service: string;
    customerName: string;
    customerEmail: string;
    date: string;
    status: string;
  };
  onStatusChange: (id: string, status: string) => void;
}

const BookingDetailsDialog = ({ isOpen, onClose, booking, onStatusChange }: BookingDetailsDialogProps) => {
  const [status, setStatus] = useState(booking?.status || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  if (!booking) return null;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleSave = () => {
    if (status && status !== booking.status) {
      onStatusChange(booking.id, status);
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${status}`,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>Booking ID: #{booking.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Service</Label>
              <p className="font-medium">{booking.service}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Date</Label>
              <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Customer</Label>
            <p className="font-medium">{booking.customerName}</p>
            <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the booking as canceled and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onStatusChange(booking.id, "canceled");
              setIsAlertOpen(false);
              onClose();
            }}>
              Yes, cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default BookingDetailsDialog;
