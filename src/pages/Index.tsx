
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { StarIcon, StarHalfIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const Index = () => {
  const showToast = () => {
    toast({
      title: "Welcome",
      description: "Thank you for visiting our heritage site!",
    });
  };

  // Sample carousel images - in a real app these would come from a CMS or database
  const carouselImages = [
    { 
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027", 
      alt: "Historical landmark with mountains in background",
      caption: "Our preservation site in the mountains, circa 1923"
    },
    { 
      src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716", 
      alt: "Ancient stone bridge over waterfall",
      caption: "The Heritage Bridge, restored in 1967"
    },
    { 
      src: "https://images.unsplash.com/photo-1466442929976-97f336a657be", 
      alt: "Traditional architectural buildings",
      caption: "Cultural heritage buildings preserved by our foundation"
    },
    { 
      src: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e", 
      alt: "Historical buildings at night",
      caption: "Night tour of preserved historical town, available seasonally"
    },
    { 
      src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098", 
      alt: "Cathedral interior",
      caption: "Interior restoration project completed in 2018"
    },
  ];

  // Sample reviews
  const reviews = [
    {
      name: "Elizabeth Harrison",
      rating: 5,
      text: "The guided tour was exceptional. The artifacts were beautifully preserved and the guide was incredibly knowledgeable about the history."
    },
    {
      name: "Michael Chen",
      rating: 4.5,
      text: "Stunning collection of historical artifacts. The interactive displays really bring history to life. Would highly recommend."
    },
    {
      name: "John Andrews",
      rating: 5,
      text: "As a history professor, I was deeply impressed by the attention to detail and historical accuracy. A must-visit for anyone interested in our cultural heritage."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-playfair font-bold mb-6 animate-fade-in">Heritage & History Preserved</h1>
              <p className="text-xl mb-8 animate-fade-in opacity-90">
                Preserving our cultural legacy through artifacts, stories, and services since 1895.
              </p>
              <Button 
                onClick={showToast} 
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium tracking-wide animate-fade-in"
              >
                Explore Our Collection
              </Button>
            </div>
            
            {/* Carousel */}
            <div className="max-w-4xl mx-auto mt-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {carouselImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg">
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={image.src} 
                              alt={image.alt} 
                              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                            />
                          </AspectRatio>
                          <div className="bg-black bg-opacity-50 p-3 text-white text-center">
                            <p className="text-sm font-light italic">{image.caption}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4" />
                <CarouselNext className="right-2 md:right-4" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Founded in 1895, our institution has been at the forefront of preserving 
                and showcasing the rich cultural heritage of our region. Through careful 
                conservation, research, and education, we connect the past with the present
                for future generations.
              </p>
            </div>

            {/* Featured Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-playfair">Artifact Collection</CardTitle>
                  <CardDescription>Explore our unique historical artifacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Discover rare items dating back centuries, meticulously preserved and documented.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/artifacts">
                    <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">Browse Collection</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-playfair">Heritage Blog</CardTitle>
                  <CardDescription>Stories from our archives</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Read fascinating historical accounts, research findings, and curatorial insights.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/blog">
                    <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">Read Articles</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-playfair">Our Services</CardTitle>
                  <CardDescription>Professional heritage services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>From guided tours to conservation consultations, explore our professional services.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/services">
                    <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">View Services</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Company History Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-playfair font-bold mb-6 text-center">Our Rich History</h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="space-y-4">
                    <p className="text-slate-700">
                      Established in 1895 by renowned historian Professor Edward Thornhill, 
                      our organization began as a small private collection dedicated to preserving 
                      local artifacts threatened by rapid industrialization.
                    </p>
                    <p className="text-slate-700">
                      By the early 1900s, we had expanded into a full-fledged heritage institution, 
                      opening our first public museum in 1912. During the interwar period, our 
                      team conducted several significant archaeological expeditions that uncovered 
                      important historical treasures now featured in our main gallery.
                    </p>
                    <p className="text-slate-700">
                      Today, we stand as one of the country's preeminent cultural heritage organizations, 
                      with over 50,000 artifacts in our collection, award-winning conservation programs, 
                      and educational initiatives that reach more than 100,000 people annually.
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative h-80 w-80 rounded-full overflow-hidden border-8 border-amber-100">
                    <img 
                      src="https://images.unsplash.com/photo-1492321936769-b49830bc1d1e" 
                      alt="Historical building" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-3xl font-bold text-amber-700">1895</h3>
                  <p className="text-sm mt-1">Founded</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-3xl font-bold text-amber-700">50,000+</h3>
                  <p className="text-sm mt-1">Artifacts Preserved</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-3xl font-bold text-amber-700">100K+</h3>
                  <p className="text-sm mt-1">Annual Visitors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-playfair font-bold mb-10 text-center">What Our Visitors Say</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex mb-2">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                    {review.rating % 1 !== 0 && (
                      <StarHalfIcon className="h-5 w-5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <p className="italic text-slate-600 mb-4">"{review.text}"</p>
                  <p className="font-semibold text-slate-800">- {review.name}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <a 
                href="#" 
                className="inline-flex items-center text-amber-700 hover:text-amber-600 font-medium"
              >
                View more reviews on Google
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-playfair font-bold mb-10 text-center">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">
                    What are your opening hours?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our main exhibition halls are open Tuesday through Sunday from 10:00 AM to 5:00 PM. 
                    We are closed on Mondays and major holidays. The research library is open by appointment 
                    only on weekdays from 1:00 PM to 4:00 PM.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">
                    Do you offer guided tours?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer guided tours daily at 11:00 AM and 2:00 PM. These tours last approximately 
                    90 minutes and cover our main exhibition highlights. For specialized or group tours, 
                    please book at least two weeks in advance through our Services page.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">
                    Can I donate historical items to your collection?
                  </AccordionTrigger>
                  <AccordionContent>
                    We welcome inquiries about potential donations to our collection. Please contact our 
                    curatorial department with photographs and information about your items. Our acquisition 
                    committee reviews potential donations quarterly to determine if they align with our 
                    collection policy and preservation capabilities.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-medium">
                    Are photographs allowed in the exhibition areas?
                  </AccordionTrigger>
                  <AccordionContent>
                    Photography for personal use is permitted in most permanent exhibition areas, without flash. 
                    Some special exhibitions or loaned artifacts may have photography restrictions, which will be 
                    clearly marked. Commercial photography requires prior written permission.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-medium">
                    Do you offer educational programs for schools?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a variety of educational programs tailored for different age groups and 
                    curriculum needs. These include interactive tours, workshops, and outreach programs where 
                    our educators visit schools. Please contact our Education Department at least one month in 
                    advance to schedule a school visit.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-amber-700 to-amber-900 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6">Become Part of History</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Book a service, explore our artifacts, or simply learn from our extensive collection of historical resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services">
                <Button className="bg-white hover:bg-gray-100 text-amber-900 font-medium">Book a Service</Button>
              </Link>
              <Link to="/artifacts">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Artifacts
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
