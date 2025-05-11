
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <AdminLayout pageTitle="Service Bookings">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4 w-full">
          <div className="relative w-full sm:w-64 md:w-96">
            <Input 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
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
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{booking.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900">{booking.customerName}</div>
                      <div className="text-sm text-slate-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadgeClasses(booking.status)
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-sm border-slate-300 rounded-md text-slate-700 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-500">No bookings found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingList;
