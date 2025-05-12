
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookingDetailsDialog from "@/components/admin/BookingDetailsDialog";
import { Search, Eye } from "lucide-react";

// Temporary mock data until we connect to Supabase
const MOCK_BOOKINGS = [
  {
    id: "1",
    service: "Guided Museum Tour",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    date: "2023-09-15",
    status: "confirmed"
  },
  {
    id: "2",
    service: "Conservation Workshop",
    customerName: "Emily Johnson",
    customerEmail: "emily@example.com",
    date: "2023-09-18",
    status: "pending"
  },
  {
    id: "3",
    service: "Private Artifact Viewing",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    date: "2023-09-20",
    status: "confirmed"
  },
  {
    id: "4",
    service: "Educational School Program",
    customerName: "Lincoln Elementary School",
    customerEmail: "principal@lincoln.edu",
    date: "2023-09-22",
    status: "confirmed"
  },
  {
    id: "5",
    service: "Heritage Lecture Series",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    date: "2023-09-25",
    status: "pending"
  },
  {
    id: "6",
    service: "Historical Research Assistance",
    customerName: "David Lee",
    customerEmail: "david@example.com",
    date: "2023-09-27",
    status: "canceled"
  },
  {
    id: "7",
    service: "Guided Museum Tour",
    customerName: "Alexandra Martinez",
    customerEmail: "alex@example.com",
    date: "2023-09-28",
    status: "confirmed"
  }
];

const AdminBookingList = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: typeof MOCK_BOOKINGS[0]) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    // Here we would normally update in Supabase
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
    
    toast({
      title: "Booking Updated",
      description: `Booking status changed to ${newStatus}`,
    });
  };

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
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
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="flex items-center gap-2 font-medium text-sm text-slate-700">
            <span>Status:</span>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === "confirmed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("confirmed")}
              >
                Confirmed
              </Button>
              <Button 
                variant={statusFilter === "canceled" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("canceled")}
              >
                Canceled
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{booking.service}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-900">{booking.customerName}</div>
                      <div className="text-sm text-slate-500">{booking.customerEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadgeClasses(booking.status)
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-slate-500">No bookings found</div>
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
