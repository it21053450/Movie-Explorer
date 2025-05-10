import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import MovieDetailsModal from "@/components/movie-details-modal";
import { GenreButton } from "@/components/genre-button";
import { fetchTrendingMovies, fetchGenres, discoverMovies } from "@/lib/tmdb-api";
import { MovieResult, GenreResult } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [, navigate] = useLocation();
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches).slice(0, 5));
      } catch (error) {
        console.error("Failed to parse recent searches from localStorage");
      }
    }
  }, []);
  
  // Fetch popular movies
  const { 
    data: popularMovies,
    isLoading: isLoadingPopular,
    error: popularError 
  } = useQuery({
    queryKey: ["/api/movies/trending", "week", 1],
    queryFn: () => fetchTrendingMovies("week", 1),
  });
  
  // Fetch genres
  const { 
    data: genres,
    isLoading: isLoadingGenres
  } = useQuery({
    queryKey: ["/api/genres"],
    queryFn: fetchGenres,
  });

  const handleMovieClick = (movie: MovieResult) => {
    setSelectedMovie(movie.id);
    setIsDetailsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300); // Wait for transition
  };
  
  const handleStartExploring = () => {
    navigate("/trending");
  };
  
  const handleSearchFromRecent = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleFilterByGenre = (genre: GenreResult) => {
    navigate(`/search?genre=${genre.id}&name=${encodeURIComponent(genre.name)}`);
  };
  
  return (
    <>
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=400&q=80" 
          alt="Movie theater with empty seats" 
          className="w-full h-48 sm:h-64 md:h-80 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Discover Amazing Movies</h2>
          <p className="text-white text-sm md:text-base mb-4 max-w-xl">
            Search, explore, and find your next favorite film from thousands of titles
          </p>
          <Button 
            className="bg-primary hover:bg-primary/80 text-white py-2 px-6 rounded-full flex items-center ripple"
            onClick={handleStartExploring}
          >
            <span className="material-icons mr-1">explore</span>
            Start Exploring
          </Button>
        </div>
      </div>

      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4 flex items-center">
            <span className="material-icons mr-2 text-primary">history</span>
            Recent Searches
          </h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {recentSearches.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm py-1 px-3 rounded-full whitespace-nowrap"
                onClick={() => handleSearchFromRecent(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Now Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="material-icons mr-2 text-primary">whatshot</span>
          Popular Now
        </h2>
        
        {isLoadingPopular ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : popularError ? (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">Failed to load popular movies.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : popularMovies?.results && popularMovies.results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularMovies.results.slice(0, 10).map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={handleMovieClick}
                showFavoriteButton
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">No popular movies found.</p>
        )}
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            className="flex items-center mx-auto"
            onClick={() => navigate("/trending")}
          >
            <span className="material-icons mr-1">add</span>
            View More
          </Button>
        </div>
      </div>

      {/* Genres Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="material-icons mr-2 text-primary">category</span>
          Browse by Genre
        </h2>
        
        {isLoadingGenres ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : genres?.genres && genres.genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {genres.genres.slice(0, 8).map(genre => (
              <GenreButton 
                key={genre.id} 
                genre={genre} 
                onClick={handleFilterByGenre} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">No genres found.</p>
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
