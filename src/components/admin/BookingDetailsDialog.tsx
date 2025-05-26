
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { Badge } from "@/components/ui/badge";
import { useEmail } from "@/hooks/use-email";

// Define the Booking interface to match AdminBookingList
interface Booking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  time?: string;
  participants?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  created_at: string;
  // Service details from join
  services?: {
    name: string;
    price?: number;
  };
}

interface BookingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
  onStatusChange: (id: string, status: string) => void;
}

const BookingDetailsDialog = ({ isOpen, onClose, booking, onStatusChange }: BookingDetailsDialogProps) => {
  const { t } = useTranslate();
  const [status, setStatus] = useState(booking?.status || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize email hook
  const { sendBookingStatusEmail } = useEmail({
    showToast: false // We'll handle toasts manually
  });

  if (!booking) return null;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleSave = async () => {
    if (status && status !== booking.status) {
      setIsSubmitting(true);

      try {
        // Update the status first
        onStatusChange(booking.id, status);

        // Send email notification for the status change
        await sendBookingStatusEmail({
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          service_name: booking.services?.name || 'Unknown Service',
          booking_date: new Date(booking.date).toLocaleDateString(),
          booking_id: booking.id,
          status: status as 'pending' | 'confirmed' | 'canceled',
          participants: booking.participants,
          notes: booking.notes || undefined,
          cancellation_reason: status === 'canceled' ? 'Booking has been canceled by the administrator' : undefined,
        });

        toast({
          title: t('bookingUpdated'),
          description: t('bookingStatusChanged').replace('{{status}}', t(status)),
        });
        onClose();
      } catch (error) {
        console.error('Error updating status or sending email:', error);
        toast({
          title: t('error'),
          description: 'Failed to update booking status or send notification email.',
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onClose();
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'canceled':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('bookingDetails')}</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>{t('bookingId')}: #{booking.id}</span>
            <Badge className={getStatusBadgeClasses(booking.status)}>
              {t(booking.status)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">{t('bookingService')}</Label>
              <p className="font-medium">{booking.services?.name || 'Unknown Service'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('bookingDate')}</Label>
              <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
              {booking.time && (
                <p className="text-sm text-muted-foreground">{t(booking.time)}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 border-t pt-4">
            <Label className="text-sm text-muted-foreground">{t('customer')}</Label>
            <p className="font-medium">{booking.customer_name}</p>
            <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
            {booking.customer_phone && (
              <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
            )}
          </div>

          {(booking.participants || booking.notes) && (
            <div className="space-y-1 border-t pt-4">
              {booking.participants && (
                <div className="mb-2">
                  <Label className="text-sm text-muted-foreground">{t('numberOfPeople')}</Label>
                  <p className="font-medium">{booking.participants}</p>
                </div>
              )}
              {booking.notes && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('specialRequests')}</Label>
                  <p className="font-medium">{booking.notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="status">{t('bookingStatus')}</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    {t('pendingStatus')}
                  </div>
                </SelectItem>
                <SelectItem value="confirmed">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    {t('confirmedStatus')}
                  </div>
                </SelectItem>
                <SelectItem value="canceled">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div>
                    {t('canceledStatus')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving')}
              </span>
            ) : (
              t('saveChanges')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('cancelBookingConfirmation')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('cancelBookingWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('keepBooking')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  onStatusChange(booking.id, "canceled");

                  // Send cancellation email
                  await sendBookingStatusEmail({
                    customer_name: booking.customer_name,
                    customer_email: booking.customer_email,
                    service_name: booking.services?.name || 'Unknown Service',
                    booking_date: new Date(booking.date).toLocaleDateString(),
                    booking_id: booking.id,
                    status: 'canceled',
                    participants: booking.participants,
                    cancellation_reason: 'Booking has been canceled by the administrator',
                  });

                  setIsAlertOpen(false);
                  onClose();
                } catch (error) {
                  console.error('Error canceling booking or sending email:', error);
                  toast({
                    title: t('error'),
                    description: 'Failed to cancel booking or send notification email.',
                    variant: "destructive",
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('cancelBooking')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default BookingDetailsDialog;
