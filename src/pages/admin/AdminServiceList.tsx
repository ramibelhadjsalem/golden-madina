
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Temporary mock data until we connect to Supabase
const MOCK_SERVICES = [
  {
    id: "1",
    name: "Guided Museum Tour",
    duration: "90 minutes",
    price: "$20",
    bookingCount: 157
  },
  {
    id: "2",
    name: "Conservation Workshop",
    duration: "3 hours",
    price: "$45",
    bookingCount: 42
  },
  {
    id: "3",
    name: "Historical Research Assistance",
    duration: "By appointment",
    price: "$60/hour",
    bookingCount: 18
  },
  {
    id: "4",
    name: "Private Artifact Viewing",
    duration: "60 minutes",
    price: "$75",
    bookingCount: 36
  },
  {
    id: "5",
    name: "Educational School Program",
    duration: "2 hours",
    price: "$10 per student",
    bookingCount: 28
  },
  {
    id: "6",
    name: "Heritage Lecture Series",
    duration: "120 minutes",
    price: "$15",
    bookingCount: 93
  }
];

const AdminServiceList = () => {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.duration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      // Here we would normally delete from Supabase
      setServices(services.filter(service => service.id !== id));
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Heritage Services">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Input 
            placeholder="Search services..." 
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
        <Link to="/admin/services/new">
          <Button className="w-full sm:w-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Service
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Total Bookings</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {service.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {service.bookingCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/admin/services/edit/${service.id}`} 
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-slate-500">No services found</div>
                    <Link to="/admin/services/new" className="inline-block mt-3">
                      <Button variant="outline" size="sm">Add New Service</Button>
                    </Link>
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

export default AdminServiceList;
