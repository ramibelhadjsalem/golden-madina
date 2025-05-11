
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

const Index = () => {
  const showToast = () => {
    toast({
      title: "Welcome",
      description: "Thank you for visiting our heritage site!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-serif font-bold mb-6">Heritage & History Preserved</h1>
              <p className="text-xl mb-8">
                Preserving our cultural legacy through artifacts, stories, and services.
              </p>
              <Button onClick={showToast} className="bg-amber-600 hover:bg-amber-700 text-white">
                Explore Our Collection
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Founded in 1895, our institution has been at the forefront of preserving 
                and showcasing the rich cultural heritage of our region. Through careful 
                conservation, research, and education, we connect the past with the present
                for future generations.
              </p>
            </div>

            {/* Featured Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Artifact Collection</CardTitle>
                  <CardDescription>Explore our unique historical artifacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Discover rare items dating back centuries, meticulously preserved and documented.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/artifacts">
                    <Button variant="outline">Browse Collection</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heritage Blog</CardTitle>
                  <CardDescription>Stories from our archives</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Read fascinating historical accounts, research findings, and curatorial insights.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/blog">
                    <Button variant="outline">Read Articles</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our Services</CardTitle>
                  <CardDescription>Professional heritage services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>From guided tours to conservation consultations, explore our professional services.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/services">
                    <Button variant="outline">View Services</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Become Part of History</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Book a service, explore our artifacts, or simply learn from our extensive collection of historical resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services">
                <Button className="bg-slate-800 hover:bg-slate-900">Book a Service</Button>
              </Link>
              <Link to="/artifacts">
                <Button variant="outline" className="border-slate-800 text-slate-800">
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
