
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BlogDialog from "@/components/admin/BlogDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Temporary mock data until we connect to Supabase
const MOCK_BLOGS = [
  {
    id: "1",
    title: "The Origin of Our Museum Collection",
    summary: "Learn about how our prestigious collection was first established in the late 19th century.",
    author: "Dr. Eleanor Hughes",
    date: "2023-05-15",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2V1bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    title: "Restoration Techniques for Ancient Pottery",
    summary: "A deep dive into the meticulous process of restoring ceramic artifacts from the Bronze Age.",
    author: "James Richardson",
    date: "2023-06-02",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    title: "Architecture Through the Ages: A Visual Journey",
    summary: "Exploring architectural evolution from ancient civilizations to modern marvels through our collection.",
    author: "Prof. Sarah Chen",
    date: "2023-06-18",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFyY2hpdGVjdHVyZSUyMGhpc3Rvcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "4",
    title: "Lost Treasures: Rediscovering Forgotten Artifacts",
    summary: "The fascinating stories behind artifacts that were once lost to history and their journey to our collection.",
    author: "Dr. Michael Torres",
    date: "2023-07-05",
    status: "draft",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1599928577074-a188f4605511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyZWFzdXJlc3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "5",
    title: "Conservation Challenges in the Digital Age",
    summary: "How modern technology is helping us overcome preservation challenges for delicate historical artifacts.",
    author: "Lisa Montgomery",
    date: "2023-07-22",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlnaXRhbCUyMGNvbnNlcnZhdGlvbnxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    title: "The Hidden Symbolism in Renaissance Art",
    summary: "Decoding the secret messages and symbols embedded in famous Renaissance masterpieces.",
    author: "Dr. Robert Fields",
    date: "2023-08-10",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi.",
    image: "https://images.unsplash.com/photo-1577083552334-28b7fb7fab12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVuYWlzc2FuY2UlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  }
];

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<typeof MOCK_BLOGS[0] | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (blog?: typeof MOCK_BLOGS[0]) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedBlog(undefined);
    setIsDialogOpen(false);
  };

  const handleSaveBlog = (blogData: {
    title: string;
    summary: string;
    author: string;
    content: string;
    image?: string;
  }) => {
    if (selectedBlog) {
      // Update existing blog
      setBlogs(blogs.map(blog =>
        blog.id === selectedBlog.id ? {
          ...blog,
          ...blogData,
          date: blog.date, // Preserve original date
          status: blog.status, // Preserve status
          image: blogData.image || blog.image // Use new image or keep existing one
        } : blog
      ));
      toast({
        title: "Blog Updated",
        description: "The blog post has been successfully updated",
      });
    } else {
      // Create new blog
      const newBlog = {
        id: (blogs.length + 1).toString(),
        ...blogData,
        date: new Date().toISOString().split('T')[0],
        status: "published",
        image: blogData.image || "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" // Default image if none provided
      };
      setBlogs([...blogs, newBlog]);
      toast({
        title: "Blog Created",
        description: "The new blog post has been successfully created",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete));
      toast({
        title: "Blog Deleted",
        description: "The blog post has been successfully deleted",
      });
      setIsDeleteAlertOpen(false);
      setBlogToDelete(null);
    }
  };

  return (
    <>
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
        <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      {/* Grid card layout */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleOpenDialog(blog)}
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(blog.id)}
                    className="rounded-full bg-white/80 backdrop-blur-sm text-red-600 hover:bg-white hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <span className={`absolute bottom-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
                  }`}>
                  {blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{blog.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <span>By {blog.author}</span>
                  <span className="text-slate-500">{new Date(blog.date).toLocaleDateString()}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-2">{blog.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(blog)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(blog.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <div className="text-slate-500">No blog posts found</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDialog()}
            className="mt-3"
          >
            Create New Blog Post
          </Button>
        </div>
      )}

      {/* Blog Dialog */}
      <BlogDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        blog={selectedBlog}
        onSave={handleSaveBlog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminBlogList;
