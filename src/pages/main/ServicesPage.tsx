
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Temporary mock data until we connect to Supabase
const MOCK_SERVICES = [
  {
    id: "1",
    name: "Guided Museum Tour",
    description: "Experience our collection through the eyes of an expert. Our guided tours offer in-depth insights into the historical significance and artistic value of our most notable artifacts.",
    duration: "90 minutes",
    price: "$20",
    image: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzZXVtJTIwdG91cnxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    name: "Conservation Workshop",
    description: "Learn about the science and art of heritage conservation. This hands-on workshop introduces participants to the techniques used to preserve and restore historical artifacts.",
    duration: "3 hours",
    price: "$45",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc2VydmF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    name: "Historical Research Assistance",
    description: "Work with our team of historians to explore your research questions. Whether you're writing a paper, book, or simply curious about a historical topic, our experts can guide your investigation.",
    duration: "By appointment",
    price: "$60/hour",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzZWFyY2glMjBsaWJyYXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "4",
    name: "Private Artifact Viewing",
    description: "Get up close with artifacts not currently on public display. This exclusive experience allows small groups to view select pieces from our archives with a curator's guidance.",
    duration: "60 minutes",
    price: "$75",
    image: "https://images.unsplash.com/photo-1572053675669-e213d8f15389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0aWZhY3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "5",
    name: "Educational School Program",
    description: "Designed specifically for school groups, this interactive program combines engaging presentations with hands-on activities to introduce students to historical concepts and artifact appreciation.",
    duration: "2 hours",
    price: "$10 per student",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Nob29sJTIwZmllbGQlMjB0cmlwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    name: "Heritage Lecture Series",
    description: "Attend talks by renowned historians, archaeologists, and cultural experts. Each lecture in this monthly series explores a different aspect of historical significance related to our collection.",
    duration: "120 minutes",
    price: "$15",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGVjdHVyZXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  }
];

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    date: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here we would normally send the booking data to Supabase
    console.log("Booking submitted:", { service: selectedService, ...bookingForm });

    // Show success message
    toast({
      title: "Booking Request Submitted",
      description: `Thank you for booking ${selectedService.name}. We'll contact you shortly to confirm.`,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_SERVICES.map((service) => (
              <Card key={service.id} className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">{service.name}</CardTitle>
                  <CardDescription>
                    Duration: {service.duration} • {service.price}
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
                    Book This Service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="font-serif">Book {selectedService.name}</CardTitle>
              <CardDescription>
                Duration: {selectedService.duration} • {selectedService.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
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
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="date">Preferred Date</Label>
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
                  <Label htmlFor="notes">Special Requests (optional)</Label>
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Submit Booking
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
