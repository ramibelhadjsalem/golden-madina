
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
  },
  {
    id: "2",
    title: "Restoration Techniques for Ancient Pottery",
    summary: "A deep dive into the meticulous process of restoring ceramic artifacts from the Bronze Age.",
    author: "James Richardson",
    date: "2023-06-02",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
  },
  {
    id: "3",
    title: "Architecture Through the Ages: A Visual Journey",
    summary: "Exploring architectural evolution from ancient civilizations to modern marvels through our collection.",
    author: "Prof. Sarah Chen",
    date: "2023-06-18",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
  },
  {
    id: "4",
    title: "Lost Treasures: Rediscovering Forgotten Artifacts",
    summary: "The fascinating stories behind artifacts that were once lost to history and their journey to our collection.",
    author: "Dr. Michael Torres",
    date: "2023-07-05",
    status: "draft",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
  },
  {
    id: "5",
    title: "Conservation Challenges in the Digital Age",
    summary: "How modern technology is helping us overcome preservation challenges for delicate historical artifacts.",
    author: "Lisa Montgomery",
    date: "2023-07-22",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
  },
  {
    id: "6",
    title: "The Hidden Symbolism in Renaissance Art",
    summary: "Decoding the secret messages and symbols embedded in famous Renaissance masterpieces.",
    author: "Dr. Robert Fields",
    date: "2023-08-10",
    status: "published",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi nisl consectetur nisi, euismod nisi nisl euismod nisi."
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
  }) => {
    if (selectedBlog) {
      // Update existing blog
      setBlogs(blogs.map(blog => 
        blog.id === selectedBlog.id ? { 
          ...blog, 
          ...blogData,
          date: blog.date, // Preserve original date
          status: blog.status // Preserve status
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
        status: "published"
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
        <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-900">{blog.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{blog.summary}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {blog.author}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(blog.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenDialog(blog)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(blog.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="text-slate-500">No blog posts found</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog()}
                      className="mt-3"
                    >
                      Create New Blog Post
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
    </AdminLayout>
  );
};

export default AdminBlogList;
