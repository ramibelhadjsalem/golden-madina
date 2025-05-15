
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/main/Index";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/main/BlogPage";
import BlogDetail from "./pages/main/BlogDetail";
import ArtifactsPage from "./pages/main/ArtifactsPage";
import ArtifactDetail from "./pages/main/ArtifactDetail";
import ServicesPage from "./pages/main/ServicesPage";
import PortfolioPage from "./pages/main/PortfolioPage";
import PortfolioDetail from "./pages/main/PortfolioDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminArtifactList from "./pages/admin/AdminArtifactList";
import AdminArtifactEdit from "./pages/admin/AdminArtifactEdit";
import AdminServiceList from "./pages/admin/AdminServiceList";
import AdminBookingList from "./pages/admin/AdminBookingList";
import AdminPortfolioList from "./pages/admin/AdminPortfolioList";
import AdminPortfolioEdit from "./pages/admin/AdminPortfolioEdit";
import { useEffect } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import MainLayout from "./components/main/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { setDocumentTitle } from "@/lib/document-utils";

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
    setDocumentTitle(); // Set default document title
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<MainLayout />} >
                  <Route index element={<Index />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/artifacts" element={<ArtifactsPage />} />
                  <Route path="/artifacts/:id" element={<ArtifactDetail />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                  <Route path="/404" element={<NotFound />} />
                </Route>

                {/* Admin Login */}
                <Route path="/admin" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="blogs" element={<AdminBlogList />} />
                  <Route path="blogs/:id" element={<AdminBlogEdit />} />
                  <Route path="artifacts" element={<AdminArtifactList />} />
                  <Route path="artifacts/:id" element={<AdminArtifactEdit />} />
                  <Route path="portfolio" element={<AdminPortfolioList />} />
                  <Route path="portfolio/:id" element={<AdminPortfolioEdit />} />
                  <Route path="services" element={<AdminServiceList />} />
                  <Route path="bookings" element={<AdminBookingList />} />
                </Route>



                {/* Catch all route */}
                <Route path="*" element={<MainLayout />}>
                  <Route index element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
