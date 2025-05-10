import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// TMDb API response types
export type MovieResult = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
};

export type MovieDetailResult = MovieResult & {
  runtime: number;
  budget: number;
  revenue: number;
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  tagline: string;
  status: string;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type MovieCreditsResult = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export type VideoResult = {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
};

export type GenreResult = {
  id: number;
  name: string;
};
