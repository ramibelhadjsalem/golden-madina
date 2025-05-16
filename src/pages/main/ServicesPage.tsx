
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { supabase } from "@/lib/supabase";
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
const formatDuration = (minutes: number, t: (key: string) => string): string => {
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? t('minute') : t('minutes')}`;
  } else if (minutes === 60) {
    return `1 ${t('hour')}`;
  } else if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? t('hour') : t('hours')}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${remainingMinutes} ${remainingMinutes === 1 ? t('minute') : t('minutes')}`;
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
    phone: "",
    date: "",
    participants: 1,
    notes: ""
  });
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
  },[]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    setIsSubmitting(true);

    try {
      // Send booking data to Supabase
      const { error } = await supabase
        .from('bookings')
        .insert({
          service_id: selectedService.id,
          customer_name: bookingForm.name,
          customer_email: bookingForm.email,
          customer_phone: bookingForm.phone,
          date: bookingForm.date,
          participants: bookingForm.participants,
          notes: bookingForm.notes,
          status: 'pending'
        })
        .select();

      if (error) throw error;

      // Show success message
      toast({
        title: t('bookingRequestSubmitted'),
        description: `${t('bookingConfirmationMessage')} ${selectedService.name}. ${t('contactShortly')}`,
      });

      // Reset form
      setBookingForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        participants: 1,
        notes: ""
      });

      // Close booking form
      setSelectedService(null);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: t('error'),
        description: t('errorSubmittingBooking'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{t('servicesPageTitle')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('servicesPageDescription')}
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
              <p className="text-slate-600">{t('serviceCheckBackLater')}</p>
            </div>
          ) : (
            // Services grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden h-full hover:shadow-lg transition-shadow flex flex-col">
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
                      {t('duration')}: {formatDuration(service.duration, t)} • {formatPrice(service.price)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600">{service.description}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
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
              <CardTitle className="font-serif">{t('bookServiceTitle')} {selectedService.name}</CardTitle>
              <CardDescription>
                {t('duration')}: {formatDuration(selectedService.duration, t)} • {formatPrice(selectedService.price)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{t('bookingFormDescription')}</p>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('personalInformation')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('yourName')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        value={bookingForm.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder={t('yourName')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('emailAddress')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phoneNumber')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={bookingForm.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Details Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('bookingDetails')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">{t('preferredDate')} <span className="text-red-500">*</span></Label>
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



                    <div className="space-y-2">
                      <Label htmlFor="participants">{t('numberOfPeople')}</Label>
                      <Input
                        id="participants"
                        name="participants"
                        type="number"
                        min="1"
                        value={bookingForm.participants}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">{t('specialRequests')}</Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder={t('specialRequests')}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('submitting') : t('submitBooking')}
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
