
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Temporary mock data until we connect to Supabase
const MOCK_BLOG_POSTS = [
  {
    id: "1",
    title: "The Origin of Our Museum Collection",
    content: `
      <p class="mb-4">The collection of our museum dates back to 1895 when founder Sir Arthur Reynolds began collecting artifacts during his expeditions across Europe and Asia. What began as a personal collection of curiosities quickly grew into one of the most significant private collections of the era.</p>
      <p class="mb-4">Reynolds was particularly fascinated by ancient pottery and textiles, acquiring pieces from archaeological digs in Greece, Egypt, and Mesopotamia. His approach was revolutionary for the time, as he insisted on detailed documentation of each item's provenance—a practice that was not yet standard among collectors.</p>
      <h2 class="text-2xl font-serif font-bold my-6">From Private Collection to Public Institution</h2>
      <p class="mb-4">In 1910, Reynolds donated his entire collection to the city with the stipulation that it would be housed in a dedicated building and made accessible to the public. This donation formed the core of what would eventually become our museum.</p>
      <p class="mb-4">The original building, designed by renowned architect Thomas Milton, was constructed between 1911 and 1914 in the Neoclassical style. Its grand columns and imposing façade were intended to evoke the ancient civilizations represented in the collection.</p>
      <h2 class="text-2xl font-serif font-bold my-6">Expansion and Evolution</h2>
      <p class="mb-4">Throughout the 20th century, the collection continued to grow through acquisitions, donations, and bequests. Major additions included the Eastern Art wing in 1925, the Modern Gallery in 1968, and the Contemporary Space in 2005.</p>
      <p class="mb-4">Today, our collection comprises over 35,000 objects spanning five millennia of human creativity and innovation. From ancient artifacts to cutting-edge contemporary art, our museum stands as a testament to Reynolds' vision of creating a space where history and culture could be preserved and shared with future generations.</p>
    `,
    author: "Dr. Eleanor Hughes",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2V1bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    title: "Restoration Techniques for Ancient Pottery",
    content: `
      <p class="mb-4">The restoration of ancient pottery requires a delicate balance between preserving historical authenticity and ensuring structural integrity. Our conservation team employs techniques that have been refined over decades of practice.</p>
      <p class="mb-4">When a ceramic artifact arrives at our restoration workshop, it undergoes a thorough assessment. This includes photographic documentation, material analysis, and structural evaluation. Only after this comprehensive examination do we proceed with a tailored restoration plan.</p>
      <h2 class="text-2xl font-serif font-bold my-6">Cleaning and Stabilization</h2>
      <p class="mb-4">The first step in the restoration process involves careful cleaning to remove accumulated dirt and deposits. Depending on the pottery's condition, we may use soft brushes, specialized solvents, or even ultrasonic cleaning for particularly delicate pieces.</p>
      <p class="mb-4">Once cleaned, fragile ceramics undergo stabilization. This may involve the application of consolidants—specialized solutions that penetrate the ceramic body and strengthen it without altering its appearance.</p>
      <h2 class="text-2xl font-serif font-bold my-6">Reconstruction and Integration</h2>
      <p class="mb-4">For broken pottery, reconstruction begins with meticulous fragment alignment. Using reversible adhesives, our conservators reassemble the pieces like a three-dimensional puzzle. Missing sections present a particular challenge—ethical restoration practices dictate that any additions must be clearly distinguishable from original material while maintaining visual coherence.</p>
      <p class="mb-4">Our team uses specially formulated filling compounds that can be tinted to harmonize with the original ceramic but remain subtly different upon close inspection. This approach ensures historical transparency while creating an aesthetically unified object.</p>
      <h2 class="text-2xl font-serif font-bold my-6">Documentation and Preventive Care</h2>
      <p class="mb-4">Throughout the restoration process, detailed documentation records every material and technique applied. This information is crucial not only for historical accuracy but also for future conservators who may need to treat the object again.</p>
      <p class="mb-4">Finally, recommendations for display and storage conditions are developed to prevent future deterioration. Factors such as temperature, humidity, light exposure, and handling protocols are carefully specified to ensure the longevity of these precious artifacts for generations to come.</p>
    `,
    author: "James Richardson",
    date: "2023-06-02",
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  }
];

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const blog = MOCK_BLOG_POSTS.find(post => post.id === "1");

  // Use useEffect to handle the navigation when blog is not found
  useEffect(() => {
    if (!blog) {
      navigate("/not-found", { replace: true });
    }
  }, [blog, navigate]);

  return (
    <main className="flex-grow">
      {/* Hero Image */}
      <div className="w-full h-[40vh] relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">{blog.title}</h1>
            <p className="text-white text-opacity-90 mt-2">
              By {blog.author} • {new Date(blog.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-slate prose-lg">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Navigation */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200">
          <div className="flex justify-between">
            <Link to="/blog">
              <Button variant="outline">
                ← Back to All Articles
              </Button>
            </Link>
            <Link to="/">
              <Button>
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </main>

  );
};

export default BlogDetail;
