
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useTranslate } from "@/hooks/use-translate";
import { Skeleton } from "@/components/ui/skeleton";

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

const ServicesPage = () => {
  const { t } = useTranslate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    date: "",
    notes: ""
  });

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('available', true)
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    // Here we would normally send the booking data to Supabase
    console.log("Booking submitted:", { service: selectedService, ...bookingForm });

    // Show success message
    toast({
      title: t('bookingRequestSubmitted'),
      description: `${t('bookingConfirmationMessage')} ${selectedService.name}. ${t('contactShortly')}`,
    });

    // Reset form
    setBookingForm({
      name: "",
      email: "",
      date: "",
      notes: ""
    });

    // Close booking form
    setSelectedService(null);
  };

  return (
    <main className="flex-grow">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our range of professional heritage services designed to educate, engage, and inspire.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden h-full">
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
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-red-600 mb-2">{t('somethingWentWrong')}</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                {t('tryAgain')}
              </Button>
            </div>
          ) : services.length === 0 ? (
            // No services found
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">{t('noServicesFound')}</h3>
              <p className="text-slate-600">{t('checkBackLater')}</p>
            </div>
          ) : (
            // Services grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{service.name}</CardTitle>
                    <CardDescription>
                      {t('duration')}: {formatDuration(service.duration)} • {formatPrice(service.price)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => setSelectedService(service)}
                      className="w-full"
                    >
                      {t('bookThisService')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="font-serif">{t('book')} {selectedService.name}</CardTitle>
              <CardDescription>
                {t('duration')}: {formatDuration(selectedService.duration)} • {formatPrice(selectedService.price)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('yourName')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('emailAddress')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="date">{t('preferredDate')}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                  />
                </div>

                <div>
                  <Label htmlFor="notes">{t('specialRequests')}</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    {t('submitBooking')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default ServicesPage;
