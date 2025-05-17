import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { currentLanguage, switchLanguage, languagesList } = useLanguage();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Force sidebar closed on smaller screens when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: t('logoutSuccessful'),
        description: t('logoutSuccessMessage'),
      });
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t('error'),
        description: t('logoutErrorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      path: "/admin/blogs",
      label: "blogs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
    },
    {
      path: "/admin/artifacts",
      label: "artifacts",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7 12 2 3 7l9 5 9-5Z" />
          <path d="m3 7 9 5 9-5" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 17 9 5 9-5" />
        </svg>
      ),
    },
    {
      path: "/admin/portfolio",
      label: "portfolio",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M20.4 14.5 16 10 4 20" />
        </svg>
      ),
    },
    {
      path: "/admin/services",
      label: "services",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
        </svg>
      ),
    },
    {
      path: "/admin/bookings",
      label: "bookings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      path: "/admin/chatbot",
      label: "manageChatbotResponses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M8 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M16 10h.01"></path>
        </svg>
      ),
    },
  ];

  // Determine pageTitle based on the current route
  const currentNavItem = navItems.find((item) => item.path === location.pathname);
  const pageTitle = currentNavItem ? currentNavItem.label : "dashboard"; // Fallback to 'dashboard'

  return (
    <div className="min-h-screen bg-slate-50" dir={currentLanguage.rtl ? "rtl" : "ltr"}>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
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
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="font-serif text-xl">{t("heritageAdmin")}</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${currentLanguage.rtl ? "right-0" : "left-0"
          } z-30 h-full w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen
            ? "translate-x-0"
            : `${currentLanguage.rtl
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            }`
          }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="font-serif text-xl font-bold">
              {t("heritageAdmin")}
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === item.path
                    ? "bg-slate-800 text-amber-400"
                    : "hover:bg-slate-800"
                    }`}
                >
                  {item.icon}
                  {t(item.label)}
                </Link>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-700 space-y-3">
              {/* Language Selector */}
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center justify-between text-slate-300 hover:text-white hover:bg-slate-800"
                      aria-label={t("language")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{currentLanguage.flag}</span>
                        <span>{currentLanguage.name}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={currentLanguage.rtl ? "start" : "end"}
                    className="w-40"
                  >
                    {languagesList.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2 text-lg">{language.flag}</span>
                        {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 justify-start"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-slate-300 rounded-full border-t-transparent"></div>
                    <span>{t("loggingOut")}</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    {t("logout")}
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${currentLanguage.rtl ? "lg:mr-64" : "lg:ml-64"}`}>
        {/* Page Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              {t(pageTitle)}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;