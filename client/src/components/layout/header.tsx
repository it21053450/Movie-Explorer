import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/context/theme-context";
import { SearchBar } from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Show shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`sticky top-0 z-40 bg-white dark:bg-gray-900 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <span className="material-icons text-primary mr-2">movie</span>
                <h1 className="text-xl font-medium">Movie Explorer</h1>
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/" ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/trending">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/trending" ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Trending
                </a>
              </Link>
              <Link href="/favorites">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/favorites" ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Favorites
                </a>
              </Link>
            </div>
          )}
          
          {/* Search Bar (Only on larger screens) */}
          {user && (
            <div className="hidden md:block flex-grow max-w-md mx-4">
              <SearchBar />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              <span className={`material-icons ${isDarkMode ? 'block' : 'hidden'}`}>light_mode</span>
              <span className={`material-icons ${isDarkMode ? 'hidden' : 'block'}`}>dark_mode</span>
            </Button>
            
            {/* User Menu */}
            {user && (
              <div className="ml-3 relative">
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <span className="sr-only">Open user menu</span>
                      <span className="material-icons">account_circle</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{user.username}</span>
                    </div>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Search Bar (visible on smaller screens) */}
        {user && (
          <div className="block md:hidden pb-4">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
