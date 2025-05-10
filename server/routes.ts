import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // TMDb API proxy
  const tmdbBaseUrl = "https://api.themoviedb.org/3";
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error("TMDB_API_KEY environment variable is required");
    process.exit(1);
  }

  // Trending movies endpoint
  app.get("/api/movies/trending/:timeWindow", async (req, res) => {
    try {
      const { timeWindow } = req.params; // 'day' or 'week'
      const response = await fetch(
        `${tmdbBaseUrl}/trending/movie/${timeWindow}?api_key=${apiKey}&language=en-US&page=${req.query.page || 1}`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      res.status(500).json({ message: "Failed to fetch trending movies" });
    }
  });

  // Search movies endpoint
  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.query;
      const page = req.query.page || 1;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      
      const response = await fetch(
        `${tmdbBaseUrl}/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  // Movie details endpoint
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}?api_key=${apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });

  // Movie credits (cast & crew) endpoint
  app.get("/api/movies/:id/credits", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}/credits?api_key=${apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie credits:", error);
      res.status(500).json({ message: "Failed to fetch movie credits" });
    }
  });

  // Movie videos (trailers) endpoint
  app.get("/api/movies/:id/videos", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}/videos?api_key=${apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie videos:", error);
      res.status(500).json({ message: "Failed to fetch movie videos" });
    }
  });

  // Similar movies endpoint
  app.get("/api/movies/:id/similar", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      res.status(500).json({ message: "Failed to fetch similar movies" });
    }
  });

  // Movie genres endpoint
  app.get("/api/genres", async (req, res) => {
    try {
      const response = await fetch(
        `${tmdbBaseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  // Discover movies endpoint (for filtering by genre, year, etc.)
  app.get("/api/movies/discover", async (req, res) => {
    try {
      const { genre, year, sort_by, page = 1 } = req.query;
      
      let url = `${tmdbBaseUrl}/discover/movie?api_key=${apiKey}&language=en-US&page=${page}`;
      
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
      if (sort_by) url += `&sort_by=${sort_by}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error discovering movies:", error);
      res.status(500).json({ message: "Failed to discover movies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
