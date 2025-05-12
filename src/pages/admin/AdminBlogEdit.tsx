import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor, { BlogPost } from "@/components/admin/BlogEditor";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";

// Temporary mock data until we connect to Supabase
const MOCK_BLOGS = [
  {
    id: "1",
    title: "The Origin of Our Museum Collection",
    author: "Dr. Eleanor Hughes",
    date: "2023-05-15",
    summary: "Discover the fascinating history behind our museum's collection, from its humble beginnings to becoming one of the most significant cultural institutions.",
    content: `
      <h1>The Origin of Our Museum Collection</h1>
      <p>The collection of our museum dates back to 1895 when founder Sir Arthur Reynolds began collecting artifacts during his expeditions across Europe and Asia. What began as a personal collection of curiosities quickly grew into one of the most significant private collections of the era.</p>
      <p>Reynolds was particularly fascinated by ancient pottery and textiles, acquiring pieces from archaeological digs in Greece, Egypt, and Mesopotamia. His approach was revolutionary for the time, as he insisted on detailed documentation of each item's provenance—a practice that was not yet standard among collectors.</p>
      <h2>From Private Collection to Public Institution</h2>
      <p>In 1910, Reynolds donated his entire collection to the city with the stipulation that it would be housed in a dedicated building and made accessible to the public. This donation formed the core of what would eventually become our museum.</p>
      <p>The original building, designed by renowned architect Thomas Milton, was constructed between 1911 and 1914 in the Neoclassical style. Its grand columns and imposing façade were intended to evoke the ancient civilizations represented in the collection.</p>
      <h2>Expansion and Evolution</h2>
      <p>Throughout the 20th century, the collection continued to grow through acquisitions, donations, and bequests. Major additions included the Eastern Art wing in 1925, the Modern Gallery in 1968, and the Contemporary Space in 2005.</p>
      <p>Today, our collection comprises over 35,000 objects spanning five millennia of human creativity and innovation. From ancient artifacts to cutting-edge contemporary art, our museum stands as a testament to Reynolds' vision of creating a space where history and culture could be preserved and shared with future generations.</p>
    `,
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2V1bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    status: "published"
  },
  {
    id: "2",
    title: "Restoration Techniques for Ancient Pottery",
    author: "James Richardson",
    date: "2023-06-02",
    summary: "An in-depth look at the meticulous process of restoring ancient pottery artifacts, from initial assessment to final preservation.",
    content: `
      <h1>Restoration Techniques for Ancient Pottery</h1>
      <p>The restoration of ancient pottery requires a delicate balance between preserving historical authenticity and ensuring structural integrity. Our conservation team employs techniques that have been refined over decades of practice.</p>
      <p>When a ceramic artifact arrives at our restoration workshop, it undergoes a thorough assessment. This includes photographic documentation, material analysis, and structural evaluation. Only after this comprehensive examination do we proceed with a tailored restoration plan.</p>
      <h2>Cleaning and Stabilization</h2>
      <p>The first step in the restoration process involves careful cleaning to remove accumulated dirt and deposits. Depending on the pottery's condition, we may use soft brushes, specialized solvents, or even ultrasonic cleaning for particularly delicate pieces.</p>
      <p>Once cleaned, fragile ceramics undergo stabilization. This may involve the application of consolidants—specialized solutions that penetrate the ceramic body and strengthen it without altering its appearance.</p>
      <h2>Reconstruction and Integration</h2>
      <p>For broken pottery, reconstruction begins with meticulous fragment alignment. Using reversible adhesives, our conservators reassemble the pieces like a three-dimensional puzzle. Missing sections present a particular challenge—ethical restoration practices dictate that any additions must be clearly distinguishable from original material while maintaining visual coherence.</p>
      <p>Our team uses specially formulated filling compounds that can be tinted to harmonize with the original ceramic but remain subtly different upon close inspection. This approach ensures historical transparency while creating an aesthetically unified object.</p>
      <h2>Documentation and Preventive Care</h2>
      <p>Throughout the restoration process, detailed documentation records every material and technique applied. This information is crucial not only for historical accuracy but also for future conservators who may need to treat the object again.</p>
      <p>Finally, recommendations for display and storage conditions are developed to prevent future deterioration. Factors such as temperature, humidity, light exposure, and handling protocols are carefully specified to ensure the longevity of these precious artifacts for generations to come.</p>
    `,
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    status: "published"
  }
];

const AdminBlogEdit = () => {
  const { t } = useTranslate();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch blog data if editing an existing blog
    if (id && id !== "new") {
      // In a real app, this would be an API call
      const foundBlog = MOCK_BLOGS.find(blog => blog.id === id);
      
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        toast({
          title: t('error'),
          description: t('blogNotFound'),
          variant: "destructive",
        });
        navigate("/admin/blogs");
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, t]);

  const handleSaveBlog = (blogData: BlogPost) => {
    // In a real app, this would be an API call to save the blog
    console.log("Saving blog:", blogData);
    
    // Show success message
    toast({
      title: id && id !== "new" ? t('blogUpdated') : t('blogCreated'),
      description: id && id !== "new" ? t('blogUpdateSuccess') : t('blogCreateSuccess'),
    });
    
    // Navigate back to blog list
    navigate("/admin/blogs");
  };

  const handleCancel = () => {
    navigate("/admin/blogs");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {id && id !== "new" ? t('editBlog') : t('createNewBlog')}
        </h1>
        <p className="text-gray-500 mt-1">
          {id && id !== "new" ? t('editBlogDescription') : t('createBlogDescription')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <BlogEditor
          blog={blog}
          onSave={handleSaveBlog}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default AdminBlogEdit;
