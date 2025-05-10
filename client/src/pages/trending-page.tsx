import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MovieCard } from "@/components/movie-card";
import MovieDetailsModal from "@/components/movie-details-modal";
import { fetchTrendingMovies } from "@/lib/tmdb-api";
import { MovieResult } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function TrendingPage() {
  const [, navigate] = useLocation();
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch trending movies with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["/api/movies/trending", timeWindow],
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(timeWindow, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
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
  
  const handleTimeWindowChange = (value: string) => {
    setTimeWindow(value as "day" | "week");
  };
  
  // Filter movies based on selected genre
  const filteredMovies = data?.pages.flatMap(page => 
    selectedGenre === "all" 
      ? page.results 
      : page.results.filter(movie => 
          movie.genre_ids?.includes(parseInt(selectedGenre))
        )
  );

  return (
    <>
      {/* Filter Options */}
      <div className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-3">Filter Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="time-window" className="block text-sm font-medium text-muted-foreground mb-1">
              Time Period
            </Label>
            <Select value={timeWindow} onValueChange={handleTimeWindowChange}>
              <SelectTrigger id="time-window">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="trending-genre" className="block text-sm font-medium text-muted-foreground mb-1">
              Genre
            </Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="trending-genre">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="28">Action</SelectItem>
                <SelectItem value="12">Adventure</SelectItem>
                <SelectItem value="16">Animation</SelectItem>
                <SelectItem value="35">Comedy</SelectItem>
                <SelectItem value="80">Crime</SelectItem>
                <SelectItem value="18">Drama</SelectItem>
                <SelectItem value="27">Horror</SelectItem>
                <SelectItem value="10749">Romance</SelectItem>
                <SelectItem value="878">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="trending-sort" className="block text-sm font-medium text-muted-foreground mb-1">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="trending-sort">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="vote_average">Rating</SelectItem>
                <SelectItem value="release_date">Release Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Trending Movies Content */}
      <div>
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="material-icons mr-2 text-primary">trending_up</span>
          Trending {timeWindow === "day" ? "Today" : "This Week"}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">Failed to load trending movies.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredMovies && filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard 
                key={`${movie.id}-${timeWindow}`} 
                movie={movie} 
                onClick={handleMovieClick}
                showFavoriteButton
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">
            {selectedGenre !== "all" 
              ? "No movies found for the selected genre." 
              : "No trending movies found."}
          </p>
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
