
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ServiceDialog from "@/components/admin/ServiceDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Define consistent type for services
type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  bookingCount: number;
  description: string; // Make it non-optional here to match MOCK_SERVICES
};

// Temporary mock data until we connect to Supabase
const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Guided Museum Tour",
    duration: "90 minutes",
    price: "$20",
    bookingCount: 157,
    description: "Explore our museum's highlights with an expert guide who will provide fascinating insights into the artifacts and their historical context."
  },
  {
    id: "2",
    name: "Conservation Workshop",
    duration: "3 hours",
    price: "$45",
    bookingCount: 42,
    description: "Learn about conservation techniques used to preserve historical artifacts, with hands-on demonstrations and activities."
  },
  {
    id: "3",
    name: "Historical Research Assistance",
    duration: "By appointment",
    price: "$60/hour",
    bookingCount: 18,
    description: "Get personalized assistance from our research team for academic projects, genealogy searches, or historical investigations."
  },
  {
    id: "4",
    name: "Private Artifact Viewing",
    duration: "60 minutes",
    price: "$75",
    bookingCount: 36,
    description: "Enjoy an exclusive, private viewing of selected artifacts not currently on public display, with expert commentary."
  },
  {
    id: "5",
    name: "Educational School Program",
    duration: "2 hours",
    price: "$10 per student",
    bookingCount: 28,
    description: "Specially designed interactive programs for school groups, tailored to different age ranges and curriculum requirements."
  },
  {
    id: "6",
    name: "Heritage Lecture Series",
    duration: "120 minutes",
    price: "$15",
    bookingCount: 93,
    description: "Attend fascinating lectures by renowned historians and researchers on various topics related to our collections and cultural heritage."
  }
];

// Define the input type for the dialog
type ServiceInput = {
  name: string;
  duration: string;
  price: string;
  description: string; // Make it required here to match the Service type
};

const AdminServiceList = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.duration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (service?: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedService(undefined);
    setIsDialogOpen(false);
  };

  const handleSaveService = (serviceData: ServiceInput) => {
    if (selectedService) {
      // Update existing service
      setServices(services.map(service =>
        service.id === selectedService.id ? {
          ...service,
          ...serviceData,
          bookingCount: service.bookingCount // Preserve original count
        } : service
      ));
      toast({
        title: "Service Updated",
        description: "The service has been successfully updated",
      });
    } else {
      // Create new service
      const newService: Service = {
        id: (services.length + 1).toString(),
        ...serviceData,
        bookingCount: 0
      };
      setServices([...services, newService]);
      toast({
        title: "Service Created",
        description: "The new service has been successfully created",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      setServices(services.filter(service => service.id !== serviceToDelete));
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted",
      });
      setIsDeleteAlertOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <>
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
        <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-900">{service.name}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {service.duration}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {service.price}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-900">
                      {service.bookingCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(service.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="text-slate-500">No services found</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog()}
                      className="mt-3"
                    >
                      Add New Service
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Service Dialog */}
      <ServiceDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        service={selectedService}
        onSave={handleSaveService}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminServiceList;
