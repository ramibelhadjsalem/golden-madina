
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Define the Service type based on our Supabase schema
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_url: string;
  available: boolean;
  max_capacity: number | null;
  created_at: string;
}

// Helper function to format duration
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (minutes === 60) {
    return `1 hour`;
  } else if (minutes % 60 === 0) {
    return `${minutes / 60} hours`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
};

// Helper function to format price
const formatPrice = (price: number): string => {
  return `$${price}`;
};

const AdminServiceList = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(t('errorFetchingServices'));
        toast({
          title: t('error'),
          description: t('errorFetchingServices'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Add dependency array with t

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDuration(service.duration).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditService = (serviceId: string) => {
    navigate(`/admin/services/${serviceId}`);
  };

  const handleCreateService = () => {
    navigate('/admin/services/create');
  };

  // No handleSaveService function - Using separate pages now

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    setIsSubmitting(true);

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceToDelete);

      if (error) throw error;

      // Update local state using functional update pattern
      setServices(prevServices =>
        prevServices.filter(service => service.id !== serviceToDelete)
      );

      toast({
        title: t('serviceDeleted'),
        description: t('serviceDeleteSuccess'),
      });

      // Close the dialog
      setIsDeleteAlertOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('errorDeletingService'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Input
            placeholder={t('searchServices')}
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
        <Button className="w-full sm:w-auto" onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addNewService')}
        </Button>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="w-full h-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        // Error message
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-medium text-red-600 mb-2">{t('somethingWentWrong')}</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            {t('tryAgain')}
          </Button>
        </div>
      ) : filteredServices.length === 0 ? (
        // No services found
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-medium mb-2">{t('noServicesFound')}</h3>
          <p className="text-slate-600 mb-4">{t('noServicesDescription')}</p>
          <Button onClick={handleCreateService}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addNewService')}
          </Button>
        </div>
      ) : (
        // Services grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden relative group">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                {!service.available && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {t('unavailable')}
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={service.available ? 'secondary' : 'destructive'}>
                    {service.available ? t('available') : t('unavailable')}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-serif">{service.name}</CardTitle>
                <CardDescription>
                  {t('duration')}: {formatDuration(service.duration)} • {formatPrice(service.price)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-slate-600 line-clamp-3">{service.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditService(service.id)}
                  className="flex-1 mr-2"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {t('edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(service.id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* No Service Dialog - Using separate pages now */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteService')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteServiceWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                  {t('deleting')}
                </>
              ) : (
                t('delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminServiceList;
