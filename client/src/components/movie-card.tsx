import { useState } from "react";
import { MovieResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getImageUrl, POSTER_SIZES, formatReleaseYear } from "@/lib/tmdb-api";
import { useFavorites } from "@/context/favorites-context";

interface MovieCardProps {
  movie: MovieResult;
  onClick: (movie: MovieResult) => void;
  showFavoriteButton?: boolean;
}

export function MovieCard({ movie, onClick, showFavoriteButton = false }: MovieCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  return (
    <Card 
      className="movie-card overflow-hidden cursor-pointer relative"
      onClick={() => onClick(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showFavoriteButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
          onClick={handleFavoriteClick}
          aria-label={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="material-icons text-red-500">
            {isFavorite(movie.id) ? "favorite" : "favorite_border"}
          </span>
        </Button>
      )}
      
      <div className="w-full aspect-[2/3] bg-muted overflow-hidden">
        {movie.poster_path ? (
          <img 
            src={getImageUrl(movie.poster_path, POSTER_SIZES.medium)} 
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <span className="material-icons text-4xl text-gray-400">movie</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{formatReleaseYear(movie.release_date)}</span>
          <div className="flex items-center">
            <span className="material-icons text-yellow-500 text-sm mr-1">star</span>
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
