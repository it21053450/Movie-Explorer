import { queryClient } from "./queryClient";
import { 
  MovieResult, 
  MovieDetailResult, 
  MovieCreditsResult, 
  VideoResult, 
  GenreResult 
} from "@shared/schema";

// Base image URLs for TMDb
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original"
};

export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original"
};

// Helper function to get full image URL
export function getImageUrl(path: string | null, size: string): string {
  if (!path) return ""; // Return empty string or a placeholder image URL
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

// Get trending movies
export async function fetchTrendingMovies(timeWindow: "day" | "week" = "week", page: number = 1) {
  const response = await fetch(`/api/movies/trending/${timeWindow}?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }
  return response.json();
}

// Search movies
export async function searchMovies(query: string, page: number = 1) {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query is required");
  }
  
  const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to search movies");
  }
  return response.json();
}

// Get movie details
export async function fetchMovieDetails(movieId: number): Promise<MovieDetailResult> {
  const response = await fetch(`/api/movies/${movieId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
}

// Get movie credits (cast & crew)
export async function fetchMovieCredits(movieId: number): Promise<MovieCreditsResult> {
  const response = await fetch(`/api/movies/${movieId}/credits`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie credits");
  }
  return response.json();
}

// Get movie videos (trailers)
export async function fetchMovieVideos(movieId: number) {
  const response = await fetch(`/api/movies/${movieId}/videos`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie videos");
  }
  return response.json();
}

// Get similar movies
export async function fetchSimilarMovies(movieId: number) {
  const response = await fetch(`/api/movies/${movieId}/similar`);
  if (!response.ok) {
    throw new Error("Failed to fetch similar movies");
  }
  return response.json();
}

// Get movie genres
export async function fetchGenres() {
  const response = await fetch(`/api/genres`);
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  return response.json();
}

// Discover movies (filter by genre, year, etc.)
export async function discoverMovies({
  genre,
  year,
  sortBy = "popularity.desc",
  page = 1
}: {
  genre?: number;
  year?: number;
  sortBy?: string;
  page?: number;
}) {
  let url = `/api/movies/discover?page=${page}&sort_by=${sortBy}`;
  if (genre) url += `&genre=${genre}`;
  if (year) url += `&year=${year}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to discover movies");
  }
  return response.json();
}

// Format runtime from minutes to hours and minutes
export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}min` : ''}`;
}

// Format release date to year only
export function formatReleaseYear(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).getFullYear().toString();
}

// Format vote average to single decimal point
export function formatVoteAverage(vote: number): string {
  if (vote === undefined || vote === null) return "N/A";
  return vote.toFixed(1);
}

// Get YouTube trailer URL
export function getYoutubeUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}`;
}

// Get a trailer from video results
export function getTrailer(videos: { results: VideoResult[] }): VideoResult | null {
  if (!videos.results || videos.results.length === 0) {
    return null;
  }
  
  // First try to find a trailer
  const trailer = videos.results.find(
    video => video.site === "YouTube" && video.type === "Trailer"
  );
  
  // If no trailer, try to find a teaser
  if (!trailer) {
    const teaser = videos.results.find(
      video => video.site === "YouTube" && video.type === "Teaser"
    );
    if (teaser) return teaser;
  }
  
  // If still nothing, return the first YouTube video
  const youtubeVideo = videos.results.find(video => video.site === "YouTube");
  
  return trailer || youtubeVideo || null;
}
