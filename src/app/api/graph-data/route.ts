import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Fetching graph data...");

    // Fetch all data from database with better error handling
    const [movies, users, genres, userRatings] = await Promise.allSettled([
      DatabaseService.getAllMovies(),
      DatabaseService.getAllUsers(),
      DatabaseService.getAllGenres(),
      DatabaseService.getAllUserRatings(),
    ]);

    // Check if any of the database operations failed
    if (movies.status === "rejected") {
      console.error("❌ Failed to fetch movies:", movies.reason);
      throw new Error("Failed to fetch movies from database");
    }
    if (users.status === "rejected") {
      console.error("❌ Failed to fetch users:", users.reason);
      throw new Error("Failed to fetch users from database");
    }
    if (genres.status === "rejected") {
      console.error("❌ Failed to fetch genres:", genres.reason);
      throw new Error("Failed to fetch genres from database");
    }
    if (userRatings.status === "rejected") {
      console.error("❌ Failed to fetch user ratings:", userRatings.reason);
      throw new Error("Failed to fetch user ratings from database");
    }

    const moviesData = movies.value;
    const usersData = users.value;
    const genresData = genres.value;
    const userRatingsData = userRatings.value;

    console.log(
      `📈 Found ${moviesData.length} movies, ${usersData.length} users, ${genresData.length} genres, ${userRatingsData.length} ratings`
    );

    // Transform data for graph visualization
    const graphData: {
      nodes: any[];
      edges: any[];
      stats: {
        movies: number;
        users: number;
        genres: number;
        ratings: number;
      };
    } = {
      nodes: [],
      edges: [],
      stats: {
        movies: moviesData.length,
        users: usersData.length,
        genres: genresData.length,
        ratings: userRatingsData.length,
      },
    };

    // Add user nodes
    usersData.forEach((user: any, index: number) => {
      graphData.nodes.push({
        id: user.userId,
        label: user.name,
        type: "user",
        position: [0, 0, 0], // Center user
        joinDate: user.joinDate,
        totalRatings: userRatingsData.filter(
          (r: any) => r.userId === user.userId
        ).length,
      });
    });

    // Add movie nodes
    moviesData.forEach((movie: any, index: number) => {
      const angle = (index / moviesData.length) * 2 * Math.PI;
      const radius = 3 + Math.random() * 2; // Variable radius for more randomness
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5; // Add noise to X
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5; // Add noise to Z
      const y = (Math.random() - 0.5) * 4; // More Y variation for 3D feel

      graphData.nodes.push({
        id: movie.movieId,
        label: movie.name,
        type: "movie",
        position: [x, y, z],
        year: movie.year,
        rating: movie.journoRating,
        director: movie.director,
        poster: movie.poster,
        genres: movie.genres,
        revenue: movie.revenue,
        budget: movie.budget,
      });
    });

    // Add genre nodes
    genresData.forEach((genre: any, index: number) => {
      const angle = (index / genresData.length) * 2 * Math.PI;
      const radius = 4.5 + Math.random() * 1.5; // Variable radius
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 3; // More Y variation

      graphData.nodes.push({
        id: genre.name,
        label: genre.name,
        type: "genre",
        position: [x, y, z],
        color: getGenreColor(genre.name),
        description: genre.description,
      });
    });

    // Add rating nodes (representing people with emotions)
    const uniqueEmotions = [
      ...new Set(
        userRatingsData
          .map((r: any) => r.emotion)
          .filter((emotion): emotion is string => Boolean(emotion))
      ),
    ];
    uniqueEmotions.forEach((emotion, index) => {
      const angle = (index / uniqueEmotions.length) * 2 * Math.PI;
      const radius = 6 + Math.random() * 2; // Variable radius
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2.5;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2.5;
      const y = (Math.random() - 0.5) * 5; // More Y variation for outer ring

      graphData.nodes.push({
        id: `emotion_${emotion}`,
        label: emotion,
        type: "person", // Changed from 'emotion' to 'person' to match frontend
        position: [x, y, z],
        color: getEmotionColor(emotion),
        emotion: emotion,
        age: Math.floor(Math.random() * 50) + 20, // Random age for people
      });
    });

    // Add edges
    // User -> Movie connections (ratings)
    userRatingsData.forEach((rating: any) => {
      graphData.edges.push({
        from: rating.userId,
        to: rating.movieId,
        type: "rating",
        rating: rating.rating,
        emotion: rating.emotion,
        verified: rating.verified,
        timestamp: rating.timestamp,
      });
    });

    // Movie -> Genre connections
    moviesData.forEach((movie: any) => {
      movie.genres.forEach((genreName: string) => {
        graphData.edges.push({
          from: movie.movieId,
          to: genreName,
          type: "genre",
          color: getGenreColor(genreName),
        });
      });
    });

    // User -> Genre connections (preferences)
    const userGenres = await DatabaseService.getAllUserGenres();
    userGenres.forEach((userGenre: any) => {
      graphData.edges.push({
        from: userGenre.userId,
        to: userGenre.genreId,
        type: "preference",
        color: getGenreColor(userGenre.genreId),
      });
    });

    // Emotion -> Genre connections (based on ratings)
    userRatingsData.forEach((rating: any) => {
      if (rating.emotion) {
        const movie = moviesData.find((m: any) => m.movieId === rating.movieId);
        if (movie) {
          movie.genres.forEach((genreName: string) => {
            graphData.edges.push({
              from: `emotion_${rating.emotion}`,
              to: genreName,
              type: "emotion_genre",
              color: getEmotionColor(rating.emotion!),
            });
          });
        }
      }
    });

    console.log(
      `✅ Graph data prepared: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges`
    );

    return NextResponse.json({
      success: true,
      data: graphData,
    });
  } catch (error) {
    console.error("❌ Error fetching graph data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Helper functions for colors
function getGenreColor(genreName: string): string {
  const genreColors: Record<string, string> = {
    Drama: "#ff6b6b",
    Crime: "#4ecdc4",
    Action: "#ffe66d",
    Adventure: "#ff8b94",
    Comedy: "#95e1d3",
    Romance: "#fce38a",
    SciFi: "#6c5ce7",
    Thriller: "#fd79a8",
    Documentary: "#00b894",
    Animation: "#e17055",
  };
  return genreColors[genreName] || "#cccccc";
}

function getEmotionColor(emotion: string): string {
  const emotionColors: Record<string, string> = {
    happy: "#fdcb6e",
    sad: "#74b9ff",
    excited: "#fd79a8",
    calm: "#00b894",
    angry: "#e17055",
    neutral: "#ddd",
  };
  return emotionColors[emotion] || "#cccccc";
}
