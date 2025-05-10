import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import MovieDetailsModal from "@/components/movie-details-modal";
import { searchMovies, discoverMovies } from "@/lib/tmdb-api";
import { MovieResult } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function SearchResultsPage() {
  const [location, navigate] = useLocation();
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const searchQuery = queryParams.get("q");
  const genreId = queryParams.get("genre");
  const genreName = queryParams.get("name");
  
  // Store search query in localStorage for recent searches
  useEffect(() => {
    if (searchQuery) {
      const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      
      // Add the current search to the beginning and remove duplicates
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter((q: string) => q !== searchQuery)
      ].slice(0, 5); // Keep only 5 most recent
      
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  }, [searchQuery]);
  
  // Fetch search results or discover by genre with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: [searchQuery ? "/api/movies/search" : "/api/movies/discover", searchQuery || genreId],
    queryFn: ({ pageParam = 1 }) => {
      if (searchQuery) {
        return searchMovies(searchQuery, pageParam);
      } else if (genreId) {
        return discoverMovies({ genre: Number(genreId), page: pageParam });
      }
      throw new Error("Either search query or genre is required");
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!searchQuery || !!genreId,
    initialPageParam: 1,
  });
  
  // Intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver, loadMoreRef]);

  const handleMovieClick = (movie: MovieResult) => {
    setSelectedMovie(movie.id);
    setIsDetailsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300); // Wait for transition
  };
  
  const handleClearSearch = () => {
    navigate("/");
  };
  
  const allMovies = data?.pages.flatMap(page => page.results) || [];
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium flex items-center">
          <span className="material-icons mr-2 text-primary">search</span>
          {searchQuery 
            ? `Search Results for "${searchQuery}"`
            : `${genreName || "Genre"} Movies`}
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="text-sm py-1 px-3 rounded-full flex items-center"
          onClick={handleClearSearch}
        >
          <span className="material-icons text-sm">clear</span>
          <span className="ml-1">Clear</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-destructive mb-4">Failed to load search results.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : allMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={handleMovieClick}
              showFavoriteButton
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No results found.</p>
          <Button onClick={handleClearSearch}>Go Back</Button>
        </div>
      )}
      
      {/* Infinite Scroll Loader */}
      <div 
        ref={loadMoreRef} 
        className="flex justify-center mt-8"
      >
        {isFetchingNextPage && (
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12" />
        )}
      </div>
      
      {/* Movie Details Modal */}
      <MovieDetailsModal
        movieId={selectedMovie}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        onMovieSelect={(movieId) => {
          setSelectedMovie(movieId);
          setIsDetailsModalOpen(true);
        }}
      />
    </>
  );
}
