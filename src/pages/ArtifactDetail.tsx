
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Temporary mock data until we connect to Supabase
const MOCK_ARTIFACTS = [
  {
    id: "1",
    name: "Ancient Greek Amphora",
    period: "5th Century BCE",
    description: `
      <p>This well-preserved terracotta amphora dates to approximately 450 BCE, originating from Athens during the height of Classical Greek civilization. Standing 45 centimeters tall, it exemplifies the elegant proportions and refined craftsmanship typical of the period.</p>
      <p>The vessel features the characteristic black-figure technique, with figures depicted in silhouette against the natural reddish-orange clay background. The main scene portrays Dionysus, the god of wine, surrounded by dancing maenads and satyrs—a common theme reflecting the amphora's likely use for storing wine.</p>
      <p>The amphora was discovered in 1892 during excavations of a merchant's dwelling in Piraeus, the ancient port of Athens. Its excellent condition suggests it was carefully stored and possibly treasured as a high-quality item rather than used for daily storage.</p>
      <p>Analysis of trace residues confirms the vessel was indeed used to store wine, supporting its identity as a wine amphora rather than one meant for olive oil or other goods. The characteristic pointed bottom was designed to be nestled in sand or special stands, and made the vessel well-suited for transport on ships.</p>
    `,
    category: "Pottery",
    origin: "Athens, Greece",
    materials: "Terracotta, pigments",
    dimensions: "Height: 45cm, Width: 30cm",
    acquisitionDate: "1923",
    conservationStatus: "Excellent, minimal restoration",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5jaWVudCUyMHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    additionalImages: [
      "https://images.unsplash.com/photo-1618152430066-fdd4ac4ca6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZWslMjBwb3R0ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1588867702719-969c8ac733d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3JlZWslMjBwb3R0ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    ]
  },
  {
    id: "3",
    name: "Bronze Age Ceremonial Mask",
    period: "1200 BCE",
    description: `
      <p>This extraordinary ceremonial mask dates to approximately 1200 BCE, originating from the ancient Mesopotamian city of Ur during the Late Bronze Age. Cast in bronze with remarkable precision, the mask represents one of the finest examples of metallurgical expertise from this period.</p>
      <p>The face depicts a stylized human visage with exaggerated features that scholars believe represents a deity or mythological figure. The almond-shaped eyes are inlaid with lapis lazuli, while the eyebrows and beard are delicately articulated through fine incisions in the metal. Traces of gold leaf are still visible around the lips and forehead, suggesting the mask was once partially gilded.</p>
      <p>Archaeological evidence suggests the mask was used in religious ceremonies, possibly worn by a high priest during ritual observances. The small holes along the perimeter indicate it may have been attached to a headdress or backing material.</p>
      <p>The mask was discovered in 1927 during expeditions led by renowned archaeologist Sir Leonard Woolley. It was found in a sealed chamber beneath a temple complex, alongside other ceremonial objects, protecting it from exposure and contributing to its exceptional state of preservation.</p>
    `,
    category: "Ceremonial",
    origin: "Ur, Mesopotamia (modern-day Iraq)",
    materials: "Bronze, lapis lazuli, gold leaf",
    dimensions: "Height: 22cm, Width: 15cm",
    acquisitionDate: "1934",
    conservationStatus: "Good, stabilized patina",
    hasModel: true,
    image: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJvbnplJTIwbWFza3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60",
    additionalImages: [
      "https://images.unsplash.com/photo-1577083552761-cb92219a2925?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5jaWVudCUyMG1hc2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1582640731998-f2da74db37d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFuY2llbnQlMjBtYXNrfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    ]
  }
];

const ArtifactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artifact = MOCK_ARTIFACTS.find(item => item.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);

  if (!artifact) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artifact Not Found</h2>
            <Link to="/artifacts">
              <Button>Return to Collection</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [artifact.image, ...artifact.additionalImages];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/artifacts" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Images and 3D Model */}
            <div>
              <div className="bg-slate-100 rounded-lg overflow-hidden mb-4">
                {showModel && artifact.hasModel ? (
                  <div className="aspect-square w-full bg-slate-200 flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
                        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">3D Model Viewer</h3>
                    <p className="text-slate-500 mb-4">
                      This is where the interactive 3D model would appear after connecting to Supabase for storage.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowModel(false)}
                    >
                      View Images
                    </Button>
                  </div>
                ) : (
                  <img
                    src={allImages[activeImageIndex]}
                    alt={artifact.name}
                    className="w-full h-full object-contain aspect-square"
                  />
                )}
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2 overflow-x-auto py-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImageIndex(index);
                        setShowModel(false);
                      }}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        activeImageIndex === index && !showModel
                          ? "border-amber-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                {artifact.hasModel && (
                  <Button
                    onClick={() => setShowModel(true)}
                    variant={showModel ? "default" : "outline"}
                    className={showModel ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    3D View
                  </Button>
                )}
              </div>
            </div>
            
            {/* Right: Artifact Details */}
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">{artifact.name}</h1>
              <p className="text-slate-500 mb-6">{artifact.period} • {artifact.category}</p>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description">
                  <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: artifact.description }} />
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Origin</h3>
                      <p>{artifact.origin}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Materials</h3>
                      <p>{artifact.materials}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Dimensions</h3>
                      <p>{artifact.dimensions}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Acquisition Date</h3>
                      <p>{artifact.acquisitionDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Conservation Status</h3>
                      <p>{artifact.conservationStatus}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtifactDetail;
