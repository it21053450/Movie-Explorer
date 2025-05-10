import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from "@/context/favorites-context";
import { useQuery } from "@tanstack/react-query";
import { MovieResult, MovieDetailResult, MovieCreditsResult, VideoResult } from "@shared/schema";
import TrailerModal from "./trailer-modal";
import { 
  fetchMovieDetails, 
  fetchMovieCredits, 
  fetchMovieVideos, 
  fetchSimilarMovies,
  getImageUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
  formatRuntime,
  formatReleaseYear,
  formatVoteAverage,
  getTrailer
} from "@/lib/tmdb-api";
import { Loader2 } from "lucide-react";

interface MovieDetailsModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieSelect: (movieId: number) => void;
}

export default function MovieDetailsModal({ 
  movieId, 
  isOpen, 
  onClose,
  onMovieSelect
}: MovieDetailsModalProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("overview");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // Fetch movie details
  const { 
    data: movie,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useQuery<MovieDetailResult>({
    queryKey: ["/api/movies", movieId],
    queryFn: () => fetchMovieDetails(movieId!),
    enabled: !!movieId && isOpen,
  });

  // Fetch movie credits
  const { 
    data: credits,
    isLoading: isLoadingCredits 
  } = useQuery<MovieCreditsResult>({
    queryKey: ["/api/movies", movieId, "credits"],
    queryFn: () => fetchMovieCredits(movieId!),
    enabled: !!movieId && isOpen,
  });

  // Fetch movie videos
  const { 
    data: videos,
    isLoading: isLoadingVideos 
  } = useQuery({
    queryKey: ["/api/movies", movieId, "videos"],
    queryFn: () => fetchMovieVideos(movieId!),
    enabled: !!movieId && isOpen,
  });

  // Fetch similar movies
  const { 
    data: similarMovies,
    isLoading: isLoadingSimilar 
  } = useQuery({
    queryKey: ["/api/movies", movieId, "similar"],
    queryFn: () => fetchSimilarMovies(movieId!),
    enabled: !!movieId && isOpen,
  });

  useEffect(() => {
    // Reset tab when opening a new movie
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen, movieId]);

  const handlePlayTrailer = () => {
    if (videos?.results && videos.results.length > 0) {
      const trailer = getTrailer(videos);
      if (trailer) {
        setTrailerKey(trailer.key);
        setTrailerOpen(true);
      }
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  const handleSimilarMovieClick = (movie: MovieResult) => {
    onClose();
    onMovieSelect(movie.id);
  };

  if (!isOpen || !movieId) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : detailsError ? (
            <div className="p-6 text-center">
              <p className="text-destructive">Error loading movie details.</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          ) : movie ? (
            <>
              {/* Movie header with backdrop */}
              <div className="relative">
                {/* Movie backdrop image */}
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  {movie.backdrop_path ? (
                    <img 
                      src={getImageUrl(movie.backdrop_path, BACKDROP_SIZES.large)} 
                      alt={`${movie.title} backdrop`} 
                      className="w-full h-full object-cover opacity-75" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-icons text-6xl text-gray-400">movie</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                </div>
                
                <div className="absolute top-2 right-2 z-10">
                  <Button 
                    variant="ghost"
                    className="bg-white/10 text-white hover:bg-white/20 rounded-full"
                    size="icon"
                    onClick={onClose}
                  >
                    <span className="material-icons">close</span>
                  </Button>
                </div>
                
                {/* Movie info overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-20">
                  <div className="flex flex-col sm:flex-row sm:items-end">
                    {/* Movie poster */}
                    <div className="hidden sm:block w-32 min-w-32 h-48 rounded-lg overflow-hidden shadow-lg mr-6 -mb-10 bg-gray-100 dark:bg-gray-800">
                      {movie.poster_path ? (
                        <img 
                          src={getImageUrl(movie.poster_path, POSTER_SIZES.medium)} 
                          alt={`${movie.title} poster`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-icons text-4xl text-gray-400">movie</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Movie title info */}
                    <div className="text-white">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                        {movie.title} {movie.release_date && `(${formatReleaseYear(movie.release_date)})`}
                      </h2>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-2">
                        <div className="flex items-center">
                          <span className="material-icons text-yellow-500 mr-1">star</span>
                          <span className="font-medium">{formatVoteAverage(movie.vote_average)}/10</span>
                        </div>
                        {movie.runtime > 0 && (
                          <div className="text-gray-300">{formatRuntime(movie.runtime)}</div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {movie.genres?.map(genre => (
                            <span 
                              key={genre.id} 
                              className="px-2 py-1 text-xs rounded-full bg-primary/80 text-white"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="default"
                          className="bg-white text-gray-900 hover:bg-gray-100"
                          size="sm"
                          onClick={handlePlayTrailer}
                          disabled={isLoadingVideos || !videos?.results?.length}
                        >
                          <span className="material-icons text-sm mr-1">play_arrow</span>
                          Trailer
                        </Button>
                        <Button 
                          variant="ghost"
                          className="bg-transparent hover:bg-white/10 text-white"
                          size="sm"
                          onClick={handleFavoriteToggle}
                        >
                          <span className="material-icons text-sm mr-1">
                            {isFavorite(movie.id) ? "favorite" : "favorite_border"}
                          </span>
                          {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Movie content tabs */}
              <div className="px-6 pt-8 sm:pt-0 pb-6">
                {/* Tabs navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="cast">Cast</TabsTrigger>
                    <TabsTrigger value="similar">Similar Movies</TabsTrigger>
                  </TabsList>
                  
                  {/* Overview tab */}
                  <TabsContent value="overview" className="pt-4">
                    <h3 className="text-lg font-medium mb-2">Synopsis</h3>
                    <p className="text-muted-foreground mb-6">
                      {movie.overview || "No overview available."}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Details</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex">
                            <span className="font-medium w-28">Director:</span>
                            <span>
                              {credits?.crew?.find(crew => crew.job === "Director")?.name || "Unknown"}
                            </span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-28">Writers:</span>
                            <span>
                              {credits?.crew
                                ?.filter(crew => 
                                  crew.department === "Writing" || 
                                  crew.job === "Screenplay" || 
                                  crew.job === "Writer"
                                )
                                .map(writer => writer.name)
                                .slice(0, 3)
                                .join(", ") || "Unknown"}
                            </span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-28">Release Date:</span>
                            <span>
                              {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "Unknown"}
                            </span>
                          </li>
                          {movie.budget > 0 && (
                            <li className="flex">
                              <span className="font-medium w-28">Budget:</span>
                              <span>${movie.budget.toLocaleString()}</span>
                            </li>
                          )}
                          {movie.revenue > 0 && (
                            <li className="flex">
                              <span className="font-medium w-28">Revenue:</span>
                              <span>${movie.revenue.toLocaleString()}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Production</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex">
                            <span className="font-medium w-28">Countries:</span>
                            <span>
                              {movie.production_countries
                                ?.map(country => country.name)
                                .join(", ") || "Unknown"}
                            </span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-28">Languages:</span>
                            <span>
                              {movie.spoken_languages
                                ?.map(language => language.english_name)
                                .join(", ") || "Unknown"}
                            </span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-28">Companies:</span>
                            <span>
                              {movie.production_companies
                                ?.map(company => company.name)
                                .join(", ") || "Unknown"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Cast tab */}
                  <TabsContent value="cast" className="pt-4">
                    {isLoadingCredits ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : !credits?.cast?.length ? (
                      <p className="text-center py-10 text-muted-foreground">No cast information available.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {credits.cast.slice(0, 10).map(person => (
                          <div key={person.id} className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
                              {person.profile_path ? (
                                <img 
                                  src={getImageUrl(person.profile_path, POSTER_SIZES.small)} 
                                  alt={person.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-icons text-2xl text-gray-400">person</span>
                                </div>
                              )}
                            </div>
                            <h4 className="font-medium text-sm">{person.name}</h4>
                            <p className="text-xs text-muted-foreground">{person.character}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Similar Movies tab */}
                  <TabsContent value="similar" className="pt-4">
                    {isLoadingSimilar ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : !similarMovies?.results?.length ? (
                      <p className="text-center py-10 text-muted-foreground">No similar movies found.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {similarMovies.results.slice(0, 8).map(movie => (
                          <div
                            key={movie.id}
                            className="movie-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                            onClick={() => handleSimilarMovieClick(movie)}
                          >
                            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {movie.poster_path ? (
                                <img 
                                  src={getImageUrl(movie.poster_path, POSTER_SIZES.small)} 
                                  alt={`${movie.title} poster`} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-icons text-3xl text-gray-400">movie</span>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="font-medium text-sm mb-1 line-clamp-1">{movie.title}</h3>
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{formatReleaseYear(movie.release_date)}</span>
                                <div className="flex items-center">
                                  <span className="material-icons text-yellow-500 text-xs mr-0.5">star</span>
                                  <span>{formatVoteAverage(movie.vote_average)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      
      <TrailerModal 
        isOpen={trailerOpen} 
        onClose={() => setTrailerOpen(false)} 
        videoKey={trailerKey} 
      />
    </>
  );
}
