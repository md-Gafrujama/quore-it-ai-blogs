"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/Components/NavbarNew";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import PrivateComponent from "@/Components/privateComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only close sidebar on route change for mobile devices
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <PrivateComponent>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors ml-2"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </Navbar>
          </div>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main content */}
          <div className={`pt-16 transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
          }`}>
            <main className="p-4 md:p-6">
              {children}
            </main>
          </div>

          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
        <ToastContainer />
      </AppProvider>
    </PrivateComponent>
  );
}
