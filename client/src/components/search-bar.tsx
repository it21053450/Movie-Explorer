import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  // Load last search from localStorage
  useEffect(() => {
    const lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch) {
      setSearchQuery(lastSearch);
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim().length > 2) {
      // Save search query to localStorage
      localStorage.setItem("lastSearch", searchQuery);
      
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons text-gray-400">search</span>
        </div>
        <Input
          className="pl-10 pr-3 py-2"
          placeholder="Search for movies..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
