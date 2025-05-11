
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import ArtifactsPage from "./pages/ArtifactsPage";
import ArtifactDetail from "./pages/ArtifactDetail";
import ServicesPage from "./pages/ServicesPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminArtifactList from "./pages/admin/AdminArtifactList";
import AdminServiceList from "./pages/admin/AdminServiceList";
import AdminBookingList from "./pages/admin/AdminBookingList";
import { useEffect } from "react";

// Add Google Fonts
const loadFonts = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/artifacts" element={<ArtifactsPage />} />
              <Route path="/artifacts/:id" element={<ArtifactDetail />} />
              <Route path="/services" element={<ServicesPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/blogs" element={<AdminBlogList />} />
              <Route path="/admin/artifacts" element={<AdminArtifactList />} />
              <Route path="/admin/services" element={<AdminServiceList />} />
              <Route path="/admin/bookings" element={<AdminBookingList />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
