import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("journodb");

    // Create collections if they don't exist
    const collections = [
      "movies",
      "users",
      "genres",
      "usersGenres",
      "moviesGenres",
      "userRatings",
    ];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      } catch (error: any) {
        if (error.code !== 48) {
          // Collection already exists
          console.error(`Error creating collection ${collectionName}:`, error);
        }
      }
    }

    // Create indexes for better performance
    try {
      await db
        .collection("movies")
        .createIndex({ movieId: 1 }, { unique: true });
      console.log("Created index: movies.movieId");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating movies index:", error);
      }
    }

    try {
      await db.collection("users").createIndex({ userId: 1 }, { unique: true });
      console.log("Created index: users.userId");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating users index:", error);
      }
    }

    try {
      await db.collection("genres").createIndex({ name: 1 }, { unique: true });
      console.log("Created index: genres.name");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating genres index:", error);
      }
    }

    try {
      await db
        .collection("usersGenres")
        .createIndex({ userId: 1, genreId: 1 }, { unique: true });
      console.log("Created index: usersGenres.userId_genreId");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating usersGenres index:", error);
      }
    }

    try {
      await db
        .collection("moviesGenres")
        .createIndex({ movieId: 1, genreId: 1 }, { unique: true });
      console.log("Created index: moviesGenres.movieId_genreId");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating moviesGenres index:", error);
      }
    }

    try {
      await db
        .collection("userRatings")
        .createIndex({ userId: 1, movieId: 1 }, { unique: true });
      console.log("Created index: userRatings.userId_movieId");
    } catch (error: any) {
      if (error.code !== 85) {
        // Index already exists
        console.error("Error creating userRatings index:", error);
      }
    }

    // Insert sample data

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      collections: collections,
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        details: error,
      },
      { status: 500 }
    );
  }
}
