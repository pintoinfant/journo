import moviesData from "@/data/movies.json";

export interface Movie {
  movieId: string;
  id: string;
  name: string;
  title: string;
  description: string;
  year: number;
  director: string;
  runtime: number;
  duration: string;
  revenue: number;
  budget: number;
  genres: string[];
  genre: string;
  poster: string;
  rating: number;
  journoRating: number;
  avgRating: number;
  totalRatings: number;
  weightedRatings: number;
  unweightedRatings: number;
  ens: string;
  ensSubname: string;
  cast: string[];
  awards: string[];
  award: string;
  netflixId: string;
}

export class MovieService {
  private static movies: Movie[] = moviesData as Movie[];

  // Get all movies
  static getAllMovies(): Movie[] {
    return this.movies;
  }

  // Get movie by ID (supports both id and movieId)
  static getMovieById(id: string): Movie | undefined {
    return this.movies.find((movie) => movie.id === id || movie.movieId === id);
  }

  // Get movie by title
  static getMovieByTitle(title: string): Movie | undefined {
    return this.movies.find(
      (movie) =>
        movie.title.toLowerCase() === title.toLowerCase() ||
        movie.name.toLowerCase() === title.toLowerCase()
    );
  }

  // Get movies by genre
  static getMoviesByGenre(genre: string): Movie[] {
    return this.movies.filter((movie) =>
      movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  // Get movies by year
  static getMoviesByYear(year: number): Movie[] {
    return this.movies.filter((movie) => movie.year === year);
  }

  // Get movies by director
  static getMoviesByDirector(director: string): Movie[] {
    return this.movies.filter((movie) =>
      movie.director.toLowerCase().includes(director.toLowerCase())
    );
  }

  // Search movies by title, director, or genre
  static searchMovies(query: string): Movie[] {
    const lowercaseQuery = query.toLowerCase();
    return this.movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.director.toLowerCase().includes(lowercaseQuery) ||
        movie.genres.some((genre) =>
          genre.toLowerCase().includes(lowercaseQuery)
        ) ||
        movie.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get top rated movies
  static getTopRatedMovies(limit: number = 10): Movie[] {
    return this.movies.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  // Get movies by rating range
  static getMoviesByRatingRange(
    minRating: number,
    maxRating: number = 10
  ): Movie[] {
    return this.movies.filter(
      (movie) => movie.rating >= minRating && movie.rating <= maxRating
    );
  }

  // Get random movie
  static getRandomMovie(): Movie {
    const randomIndex = Math.floor(Math.random() * this.movies.length);
    return this.movies[randomIndex];
  }

  // Get random movies
  static getRandomMovies(count: number): Movie[] {
    const shuffled = [...this.movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Get unique genres
  static getAllGenres(): string[] {
    const genres = new Set<string>();
    this.movies.forEach((movie) => {
      movie.genres.forEach((genre) => genres.add(genre));
    });
    return Array.from(genres).sort();
  }

  // Get unique directors
  static getAllDirectors(): string[] {
    const directors = new Set<string>();
    this.movies.forEach((movie) => directors.add(movie.director));
    return Array.from(directors).sort();
  }

  // Get movies count
  static getMoviesCount(): number {
    return this.movies.length;
  }

  // Get featured movies (top 3 rated)
  static getFeaturedMovies(): Movie[] {
    return this.getTopRatedMovies(3);
  }

  // Movie stats
  static getMovieStats() {
    const totalMovies = this.movies.length;
    const totalRatings = this.movies.reduce(
      (sum, movie) => sum + movie.totalRatings,
      0
    );
    const averageRating =
      this.movies.reduce((sum, movie) => sum + movie.rating, 0) / totalMovies;
    const totalRevenue = this.movies.reduce(
      (sum, movie) => sum + movie.revenue,
      0
    );
    const totalBudget = this.movies.reduce(
      (sum, movie) => sum + movie.budget,
      0
    );

    return {
      totalMovies,
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRevenue,
      totalBudget,
      genres: this.getAllGenres(),
      directors: this.getAllDirectors(),
    };
  }
}

// Export the movies data for direct access if needed
export const movies = MovieService.getAllMovies();

// Export convenience functions
export const getMovieById = MovieService.getMovieById;
export const getAllMovies = MovieService.getAllMovies;
export const searchMovies = MovieService.searchMovies;
export const getTopRatedMovies = MovieService.getTopRatedMovies;
export const getFeaturedMovies = MovieService.getFeaturedMovies;
export const getRandomMovies = MovieService.getRandomMovies;
