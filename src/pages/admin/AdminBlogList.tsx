
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Temporary mock data until we connect to Supabase
const MOCK_BLOGS = [
  {
    id: "1",
    title: "The Origin of Our Museum Collection",
    summary: "Learn about how our prestigious collection was first established in the late 19th century.",
    author: "Dr. Eleanor Hughes",
    date: "2023-05-15",
    status: "published"
  },
  {
    id: "2",
    title: "Restoration Techniques for Ancient Pottery",
    summary: "A deep dive into the meticulous process of restoring ceramic artifacts from the Bronze Age.",
    author: "James Richardson",
    date: "2023-06-02",
    status: "published"
  },
  {
    id: "3",
    title: "Architecture Through the Ages: A Visual Journey",
    summary: "Exploring architectural evolution from ancient civilizations to modern marvels through our collection.",
    author: "Prof. Sarah Chen",
    date: "2023-06-18",
    status: "published"
  },
  {
    id: "4",
    title: "Lost Treasures: Rediscovering Forgotten Artifacts",
    summary: "The fascinating stories behind artifacts that were once lost to history and their journey to our collection.",
    author: "Dr. Michael Torres",
    date: "2023-07-05",
    status: "draft"
  },
  {
    id: "5",
    title: "Conservation Challenges in the Digital Age",
    summary: "How modern technology is helping us overcome preservation challenges for delicate historical artifacts.",
    author: "Lisa Montgomery",
    date: "2023-07-22",
    status: "published"
  },
  {
    id: "6",
    title: "The Hidden Symbolism in Renaissance Art",
    summary: "Decoding the secret messages and symbols embedded in famous Renaissance masterpieces.",
    author: "Dr. Robert Fields",
    date: "2023-08-10",
    status: "published"
  }
];

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      // Here we would normally delete from Supabase
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast({
        title: "Blog Deleted",
        description: "The blog post has been successfully deleted",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Blog Posts">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Input 
            placeholder="Search blogs..." 
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
        <Link to="/admin/blogs/new">
          <Button className="w-full sm:w-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Blog Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{blog.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{blog.summary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/admin/blogs/edit/${blog.id}`} 
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-slate-500">No blog posts found</div>
                    <Link to="/admin/blogs/new" className="inline-block mt-3">
                      <Button variant="outline" size="sm">Create New Blog Post</Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogList;
