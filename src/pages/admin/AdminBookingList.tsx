
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import BookingDetailsDialog from "@/components/admin/BookingDetailsDialog";
import { Search, Eye, CheckCircle, XCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the Booking interface based on our Supabase schema
interface Booking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  time?: string;
  people?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  created_at: string;
  // Service details from join
  services?: {
    name: string;
    duration?: number;
    price?: number;
  };
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const AdminBookingList = () => {
  const { t } = useTranslate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bookings with service names using a join
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            service_id,
            customer_name,
            customer_email,
            customer_phone,
            date,
            time,
            people,
            notes,
            status,
            created_at,
            services (
              name,
              duration,
              price
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our Booking interface
        const formattedBookings = data.map(item => ({
          ...item,
          status: item.status as 'pending' | 'confirmed' | 'canceled'
        }));

        setBookings(formattedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(t('errorFetchingBookings'));
        toast({
          title: t('error'),
          description: t('errorFetchingBookings'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to refresh bookings
  const refreshBookings = async () => {
    setIsRefreshing(true);
    try {
      // Fetch bookings with service names using a join
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          customer_name,
          customer_email,
          customer_phone,
          date,
          time,
          people,
          notes,
          status,
          created_at,
          services (
            name,
            duration,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Booking interface
      const formattedBookings = data.map(item => ({
        ...item,
        status: item.status as 'pending' | 'confirmed' | 'canceled'
      }));

      setBookings(formattedBookings);
      toast({
        title: t('bookingsRefreshed'),
        description: t('bookingsRefreshedDescription'),
      });
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      toast({
        title: t('error'),
        description: t('errorFetchingBookings'),
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.services?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setIsProcessing(true);

      // Validate status
      if (!['pending', 'confirmed', 'canceled'].includes(newStatus)) {
        throw new Error('Invalid status value');
      }

      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus as 'pending' | 'confirmed' | 'canceled'
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === id ? { ...booking, status: newStatus as 'pending' | 'confirmed' | 'canceled' } : booking
      ));

      toast({
        title: t('bookingUpdated'),
        description: t('bookingStatusChanged').replace('{{status}}', t(`${newStatus}Status`)),
      });
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast({
        title: t('error'),
        description: t('errorUpdatingBooking'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, id]);
    } else {
      setSelectedBookings(prev => prev.filter(bookingId => bookingId !== id));
    }
  };

  const handleBulkAction = async (action: 'confirm' | 'cancel') => {
    if (selectedBookings.length === 0) return;

    setIsProcessing(true);

    try {
      const newStatus = action === 'confirm' ? 'confirmed' : 'canceled';

      // Update bookings in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus as 'pending' | 'confirmed' | 'canceled'
        })
        .in('id', selectedBookings);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking =>
        selectedBookings.includes(booking.id)
          ? { ...booking, status: newStatus as 'pending' | 'confirmed' | 'canceled' }
          : booking
      ));

      toast({
        title: t('bookingsUpdated'),
        description: t('multipleBookingsUpdated').replace('{{count}}', selectedBookings.length.toString()).replace('{{status}}', t(`${newStatus}Status`)),
      });

      // Clear selection after successful update
      setSelectedBookings([]);
    } catch (error) {
      console.error('Error updating bookings:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingBookings'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
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
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4 w-full">
          <div className="relative w-full sm:w-64 md:w-96">
            <Input
              placeholder={t('searchBookings')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshBookings}
            disabled={isRefreshing}
            title={t('refreshBookings')}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          <div className="flex items-center gap-2 font-medium text-sm text-slate-700">
            <span>{t('bookingStatus')}:</span>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                {t('allBookings')}
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                {t('pendingStatus')}
              </Button>
              <Button
                variant={statusFilter === "confirmed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("confirmed")}
              >
                {t('confirmedStatus')}
              </Button>
              <Button
                variant={statusFilter === "canceled" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("canceled")}
              >
                {t('canceledStatus')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {t('selectedBookings').replace('{{count}}', selectedBookings.length.toString())}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBookings([])}
              className="text-slate-500 hover:text-slate-700"
            >
              {t('clearSelection')}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('confirm')}
              disabled={isProcessing}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('processing')}
                </span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('confirmSelected')}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('cancel')}
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('processing')}
                </span>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('cancelSelected')}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredBookings.length > 0 && selectedBookings.length === filteredBookings.length}
                    onCheckedChange={handleSelectAll}
                    aria-label={t('selectAllBookings')}
                  />
                </TableHead>
                <TableHead>{t('bookingId')}</TableHead>
                <TableHead>{t('bookingService')}</TableHead>
                <TableHead>{t('customer')}</TableHead>
                <TableHead>{t('bookingDate')}</TableHead>
                <TableHead>{t('bookingStatus')}</TableHead>
                <TableHead>{t('bookingActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className={`hover:bg-slate-50 transition-colors ${selectedBookings.includes(booking.id) ? 'bg-slate-50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={(checked) => handleSelectBooking(booking.id, checked === true)}
                        aria-label={t('selectBooking')}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{booking.services?.name || 'Unknown Service'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-900">{booking.customer_name}</div>
                      <div className="text-sm text-slate-500">{booking.customer_email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(booking.date)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(booking.status)
                        }`}>
                        {t(booking.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          className="mr-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('viewBooking')}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('moreActions')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed'}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('confirmBooking')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(booking.id, 'canceled')}
                              disabled={booking.status === 'canceled'}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t('cancelBooking')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="text-slate-500">{t('noBookingsFound')}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <BookingDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={handleCloseDialog}
          booking={selectedBooking}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default AdminBookingList;
