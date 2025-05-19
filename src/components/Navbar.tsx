
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslate } from "@/hooks/use-translate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from "@/lib/config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, switchLanguage, languagesList } = useLanguage();
  const { t } = useTranslate();

  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold">
              {APP_NAME}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:!gap-x-6">
            <Link to="/" className="hover:text-amber-400 transition duration-200">
              {t('home')}
            </Link>
            <Link to="/blog" className="hover:text-amber-400 transition duration-200">
              {t('blog')}
            </Link>
            <Link to="/artifacts" className="hover:text-amber-400 transition duration-200">
              {t('artifacts')}
            </Link>
            <Link to="/services" className="hover:text-amber-400 transition duration-200">
              {t('services')}
            </Link>
            <Link to="/portfolio" className="hover:text-amber-400 transition duration-200">
              {t('portfolio')}
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 flex items-center">
                  <span className="mr-1">{currentLanguage.flag}</span>
                  <span className="hidden sm:inline">{currentLanguage.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languagesList.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => switchLanguage(language)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* admin login */}
            {/* <Link to="/admin">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
                {t('adminLogin')}
              </Button>
            </Link> */}
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
              {t('home')}
            </Link>
            <Link
              to="/blog"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t('blog')}
            </Link>
            <Link
              to="/artifacts"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t('artifacts')}
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t('services')}
            </Link>
            <Link
              to="/portfolio"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t('portfolio')}
            </Link>

            {/* Mobile Language Selector */}
            <div className="px-4 py-2 flex items-center">
              <span className="mr-2">Language:</span>
              {languagesList.map((language) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  size="sm"
                  className={`mr-2 ${currentLanguage.code === language.code ? 'bg-slate-700' : ''}`}
                  onClick={() => switchLanguage(language)}
                >
                  <span className="mr-1">{language.flag}</span>
                </Button>
              ))}
            </div>

            <Link
              to="/admin"
              className="px-4 py-2 hover:bg-slate-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t('adminLogin')}
            </Link>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
};

export default Navbar;
