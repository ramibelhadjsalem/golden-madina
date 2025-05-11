
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold">
              Heritage Co.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-amber-400 transition duration-200">
              Home
            </Link>
            <Link to="/blog" className="hover:text-amber-400 transition duration-200">
              Blog
            </Link>
            <Link to="/artifacts" className="hover:text-amber-400 transition duration-200">
              Artifacts
            </Link>
            <Link to="/services" className="hover:text-amber-400 transition duration-200">
              Services
            </Link>
            <Link to="/admin">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
                Admin Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isOpen ? "hidden" : "block"}
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isOpen ? "block" : "hidden"}
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <Collapsible open={isOpen} className="md:hidden">
          <CollapsibleContent className="py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/artifacts"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Artifacts
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
};

export default Navbar;
