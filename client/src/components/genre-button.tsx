import { Button } from "@/components/ui/button";
import { GenreResult } from "@shared/schema";

interface GenreButtonProps {
  genre: GenreResult;
  onClick: (genre: GenreResult) => void;
}

const genreColors: Record<number, string> = {
  28: "bg-primary-light dark:bg-primary-dark", // Action
  12: "bg-yellow-500 dark:bg-yellow-700", // Adventure
  16: "bg-blue-400 dark:bg-blue-600", // Animation
  35: "bg-secondary-light dark:bg-secondary-dark", // Comedy
  80: "bg-red-700 dark:bg-red-900", // Crime
  99: "bg-gray-500 dark:bg-gray-700", // Documentary
  18: "bg-green-500 dark:bg-green-700", // Drama
  10751: "bg-pink-300 dark:bg-pink-500", // Family
  14: "bg-purple-500 dark:bg-purple-700", // Fantasy
  36: "bg-amber-700 dark:bg-amber-900", // History
  27: "bg-red-500 dark:bg-red-700", // Horror
  10402: "bg-indigo-500 dark:bg-indigo-700", // Music
  9648: "bg-gray-700 dark:bg-gray-900", // Mystery
  10749: "bg-pink-500 dark:bg-pink-700", // Romance
  878: "bg-blue-500 dark:bg-blue-700", // Science Fiction
  10770: "bg-teal-500 dark:bg-teal-700", // TV Movie
  53: "bg-orange-500 dark:bg-orange-700", // Thriller
  10752: "bg-red-600 dark:bg-red-800", // War
  37: "bg-amber-600 dark:bg-amber-800", // Western
  // Default color if genre ID is not in mapping
  0: "bg-gray-500 dark:bg-gray-700",
};

const genreIcons: Record<number, string> = {
  28: "local_fire_department", // Action
  12: "explore", // Adventure
  16: "child_care", // Animation
  35: "sentiment_very_satisfied", // Comedy
  80: "security", // Crime
  99: "video_camera_back", // Documentary
  18: "theater_comedy", // Drama
  10751: "family_restroom", // Family
  14: "auto_fix_high", // Fantasy
  36: "history_edu", // History
  27: "blood_count", // Horror
  10402: "music_note", // Music
  9648: "psychology", // Mystery
  10749: "favorite", // Romance
  878: "rocket_launch", // Science Fiction
  10770: "live_tv", // TV Movie
  53: "warning", // Thriller
  10752: "gavel", // War
  37: "landscape", // Western
  // Default icon if genre ID is not in mapping
  0: "category",
};

export function GenreButton({ genre, onClick }: GenreButtonProps) {
  const colorClass = genreColors[genre.id] || genreColors[0];
  const iconName = genreIcons[genre.id] || genreIcons[0];
  
  return (
    <Button
      className={`text-white py-2 px-3 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity duration-200 ${colorClass}`}
      onClick={() => onClick(genre)}
    >
      <span className="material-icons mr-1 text-sm">{iconName}</span>
      {genre.name}
    </Button>
  );
}
