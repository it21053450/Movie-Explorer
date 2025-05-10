import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function BottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 shadow-lg z-30">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center px-4 py-2 ${
            location === "/" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/trending">
          <a className={`flex flex-col items-center justify-center px-4 py-2 ${
            location === "/trending" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <span className="material-icons">trending_up</span>
            <span className="text-xs mt-1">Trending</span>
          </a>
        </Link>
        
        <Link href="/favorites">
          <a className={`flex flex-col items-center justify-center px-4 py-2 ${
            location === "/favorites" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <span className="material-icons">favorite</span>
            <span className="text-xs mt-1">Favorites</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
