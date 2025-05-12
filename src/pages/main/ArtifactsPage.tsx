
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Temporary mock data until we connect to Supabase
const MOCK_ARTIFACTS = [
  {
    id: "1",
    name: "Ancient Greek Amphora",
    period: "5th Century BCE",
    description: "A well-preserved terracotta amphora used for storing wine and oil in ancient Greece.",
    category: "Pottery",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5jaWVudCUyMHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    name: "Medieval Illuminated Manuscript",
    period: "14th Century",
    description: "A beautifully illustrated religious text with gold leaf embellishments and vibrant pigments.",
    category: "Books",
    hasModel: false,
    image: "https://images.unsplash.com/photo-1544939514-3af5677ecd45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aWxsdW1pbmF0ZWQlMjBtYW51c2NyaXB0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    name: "Bronze Age Ceremonial Mask",
    period: "1200 BCE",
    description: "An ornate bronze mask believed to be used in religious ceremonies by ancient Mesopotamian cultures.",
    category: "Ceremonial",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJvbnplJTIwbWFza3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "4",
    name: "Victorian Era Pocket Watch",
    period: "1870s",
    description: "A gold-plated pocket watch with intricate engravings owned by a prominent industrialist.",
    category: "Jewelry",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ja2V0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "5",
    name: "Ming Dynasty Porcelain Vase",
    period: "16th Century",
    description: "A rare blue and white porcelain vase from China's Ming Dynasty, featuring intricate dragon motifs.",
    category: "Pottery",
    hasModel: false,
    image: "https://images.unsplash.com/photo-1638613067239-b7861975cef3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpbmVzZSUyMHZhc2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    name: "Renaissance Marble Sculpture",
    period: "Early 16th Century",
    description: "A finely carved marble bust depicting a nobleman, attributed to an Italian Renaissance workshop.",
    category: "Sculpture",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1545080097-cde306e433ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFyYmxlJTIwc2N1bHB0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "7",
    name: "Art Nouveau Stained Glass Window",
    period: "1900s",
    description: "A colorful stained glass panel featuring floral motifs typical of the Art Nouveau movement.",
    category: "Decorative Arts",
    hasModel: false,
    image: "https://images.unsplash.com/photo-1618335829737-2228915674e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhaW5lZCUyMGdsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "8",
    name: "Ancient Egyptian Canopic Jar",
    period: "1300 BCE",
    description: "A ceremonial jar used in ancient Egyptian burial rituals for storing mummified organs.",
    category: "Ceremonial",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1608372769516-53e4d84cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWd5cHRpYW4lMjBhcnRpZmFjdHxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  }
];

// Available categories for filtering
const CATEGORIES = ["All", "Pottery", "Books", "Ceremonial", "Jewelry", "Sculpture", "Decorative Arts"];

const ArtifactsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [show3dOnly, setShow3dOnly] = useState(false);
  
  // Filter artifacts based on search term, category, and 3D model availability
  const filteredArtifacts = MOCK_ARTIFACTS.filter(artifact => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || artifact.category === selectedCategory;
    
    const matches3dFilter = !show3dOnly || artifact.hasModel;
    
    return matchesSearch && matchesCategory && matches3dFilter;
  });

  return (
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Heritage Collection</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore our curated collection of historical artifacts spanning centuries of human creativity and innovation.
            </p>
          </div>
        </section>

        {/* Filters & Artifacts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="lg:grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1 mb-8 lg:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h2 className="text-xl font-semibold mb-6">Filter Collection</h2>
                  
                  {/* Search */}
                  <div className="mb-6">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search artifacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={category}
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="mr-2 h-4 w-4 border-slate-300 text-slate-800 focus:ring-slate-500"
                          />
                          <label htmlFor={category} className="text-sm text-slate-700">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 3D Model Filter */}
                  <div className="mb-6 flex items-center space-x-2">
                    <Checkbox
                      id="3dmodels"
                      checked={show3dOnly}
                      onCheckedChange={() => setShow3dOnly(!show3dOnly)}
                    />
                    <label
                      htmlFor="3dmodels"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show only items with 3D models
                    </label>
                  </div>
                </div>
              </div>

              {/* Artifacts Grid */}
              <div className="lg:col-span-3">
                {filteredArtifacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArtifacts.map((artifact) => (
                      <Card key={artifact.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square w-full overflow-hidden relative">
                          <img 
                            src={artifact.image} 
                            alt={artifact.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                          {artifact.hasModel && (
                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              3D Model
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="font-serif">{artifact.name}</CardTitle>
                          <p className="text-sm text-slate-500">{artifact.period} • {artifact.category}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600 line-clamp-2">{artifact.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Link 
                            to={`/artifacts/${artifact.id}`}
                            className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                          >
                            View Details →
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-lg">
                    <h3 className="text-2xl font-semibold text-slate-700 mb-2">No artifacts found</h3>
                    <p className="text-slate-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
  );
};

export default ArtifactsPage;
