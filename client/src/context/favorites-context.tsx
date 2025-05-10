import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MovieResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favorites: MovieResult[];
  addFavorite: (movie: MovieResult) => void;
  removeFavorite: (movieId: number) => void;
  clearFavorites: () => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<MovieResult[]>(() => {
    // Load favorites from localStorage on initial render
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: MovieResult) => {
    if (!isFavorite(movie.id)) {
      setFavorites((prev) => [...prev, movie]);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => {
      const movie = prev.find(m => m.id === movieId);
      const newFavorites = prev.filter((movie) => movie.id !== movieId);
      
      if (movie) {
        toast({
          title: "Removed from favorites",
          description: `${movie.title} has been removed from your favorites.`,
        });
      }
      
      return newFavorites;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast({
      title: "Favorites cleared",
      description: "All movies have been removed from your favorites.",
    });
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
