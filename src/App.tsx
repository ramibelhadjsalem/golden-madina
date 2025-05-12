
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/main/Index";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/main/BlogPage";
import BlogDetail from "./pages/main/BlogDetail";
import ArtifactsPage from "./pages/main/ArtifactsPage";
import ArtifactDetail from "./pages/main/ArtifactDetail";
import ServicesPage from "./pages/main/ServicesPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminArtifactList from "./pages/admin/AdminArtifactList";
import AdminServiceList from "./pages/admin/AdminServiceList";
import AdminBookingList from "./pages/admin/AdminBookingList";
import { useEffect } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import path from 'path';
import MainLayout from "./components/main/MainLayout";

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
              <Route path="" element={<MainLayout />} >
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/artifacts" element={<ArtifactsPage />} />
                <Route path="/artifacts/:id" element={<ArtifactDetail />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/404" element={<NotFound />} />
              </Route>


              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="blogs" element={<AdminBlogList />} />
                <Route path="artifacts" element={<AdminArtifactList />} />
                <Route path="services" element={<AdminServiceList />} />
                <Route path="bookings" element={<AdminBookingList />} />
              </Route>

              {/* 404 Page */}
              <Route path="/not-found" element={<MainLayout />}>
                <Route index element={<NotFound />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<MainLayout />}>
                <Route index element={<NotFound />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
