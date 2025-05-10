import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import MovieDetailsModal from "@/components/movie-details-modal";
import { useFavorites } from "@/context/favorites-context";
import { MovieResult } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FavoritesPage() {
  const [, navigate] = useLocation();
  const { favorites, clearFavorites } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  
  const handleMovieClick = (movie: MovieResult) => {
    setSelectedMovie(movie.id);
    setIsDetailsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300); // Wait for transition
  };
  
  const handleClearFavorites = () => {
    clearFavorites();
    setIsClearDialogOpen(false);
  };
  
  const handleExploreClick = () => {
    navigate("/");
  };
  
  const isEmpty = favorites.length === 0;
  
  return (
    <>
      {/* Empty State */}
      {isEmpty ? (
        <div className="py-12 flex flex-col items-center">
          <span className="material-icons text-6xl text-gray-400 mb-4">favorite_border</span>
          <h3 className="text-xl font-medium mb-2 text-center">No Favorite Movies Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start exploring movies and click the heart icon to add them to your favorites.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/80 text-white flex items-center"
            onClick={handleExploreClick}
          >
            <span className="material-icons mr-1">explore</span>
            Explore Movies
          </Button>
        </div>
      ) : (
        /* Favorites Content */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium flex items-center">
              <span className="material-icons mr-2 text-primary">favorite</span>
              My Favorite Movies
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="text-sm py-1 px-4 rounded-full flex items-center"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <span className="material-icons mr-1 text-sm">clear_all</span>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={handleMovieClick}
                showFavoriteButton
              />
            ))}
          </div>
        </div>
      )}
      
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
      
      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove all movies
              from your favorites list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearFavorites}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
