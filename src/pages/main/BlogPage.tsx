
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary mock data until we connect to Supabase
const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "The Origin of Our Museum Collection",
    summary: "Learn about how our prestigious collection was first established in the late 19th century.",
    author: "Dr. Eleanor Hughes",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2V1bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "Restoration Techniques for Ancient Pottery",
    summary: "A deep dive into the meticulous process of restoring ceramic artifacts from the Bronze Age.",
    author: "James Richardson",
    date: "2023-06-02",
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvdHRlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "Architecture Through the Ages: A Visual Journey",
    summary: "Exploring architectural evolution from ancient civilizations to modern marvels through our collection.",
    author: "Prof. Sarah Chen",
    date: "2023-06-18",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFyY2hpdGVjdHVyZSUyMGhpc3Rvcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 4,
    title: "Lost Treasures: Rediscovering Forgotten Artifacts",
    summary: "The fascinating stories behind artifacts that were once lost to history and their journey to our collection.",
    author: "Dr. Michael Torres",
    date: "2023-07-05",
    image: "https://images.unsplash.com/photo-1599928577074-a188f4605511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyZWFzdXJlc3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 5,
    title: "Conservation Challenges in the Digital Age",
    summary: "How modern technology is helping us overcome preservation challenges for delicate historical artifacts.",
    author: "Lisa Montgomery",
    date: "2023-07-22",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlnaXRhbCUyMGNvbnNlcnZhdGlvbnxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 6,
    title: "The Hidden Symbolism in Renaissance Art",
    summary: "Decoding the secret messages and symbols embedded in famous Renaissance masterpieces.",
    author: "Dr. Robert Fields",
    date: "2023-08-10",
    image: "https://images.unsplash.com/photo-1577083552334-28b7fb7fab12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVuYWlzc2FuY2UlMjBhcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter blogs based on search term
  const filteredBlogs = MOCK_BLOG_POSTS.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Heritage Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Explore stories, research, and insights from our collection and conservation efforts.
            </p>
          </div>
        </section>

        {/* Search & Blog List */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            {/* Search */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full p-4 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="font-serif">{blog.title}</CardTitle>
                      <CardDescription>
                        By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{blog.summary}</p>
                    </CardContent>
                    <CardFooter>
                      <Link 
                        to={`/blog/${blog.id}`}
                        className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                      >
                        Read More →
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-slate-700">No articles found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>
  );
};

export default BlogPage;
