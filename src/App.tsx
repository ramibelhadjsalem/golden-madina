
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
