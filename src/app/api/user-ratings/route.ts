import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { userId, movieId, rating, review, timestamp, worldcoinProof, vlayerProof, verified } = await request.json();

    // Validate required fields
    if (!userId || !movieId || !rating || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Invalid rating data. Rating must be between 1-10." },
        { status: 400 }
      );
    }

    // Create user rating document
    const userRating = {
      userId,
      movieId,
      rating: Number(rating),
      review: review || `Rated ${rating}/10 stars`,
      timestamp: new Date(timestamp),
      worldcoinProof: worldcoinProof || null,
      vlayerProof: vlayerProof || null,
      verified: Boolean(verified),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if user has already rated this movie
    const existingRating = await DatabaseService.getUserRating(userId, movieId);

    if (existingRating) {
      // Update existing rating
      await DatabaseService.updateUserRating(userId, movieId, {
        rating: Number(rating),
        review: userRating.review,
        timestamp: userRating.timestamp,
        worldcoinProof: userRating.worldcoinProof,
        vlayerProof: userRating.vlayerProof,
        verified: userRating.verified,
        updatedAt: new Date(),
      });

      console.log(`✅ Updated rating for user ${userId} on movie ${movieId}`);
      return NextResponse.json({
        success: true,
        message: "Rating updated successfully",
        rating: userRating,
      });
    } else {
      // Insert new rating
      await DatabaseService.createUserRating({
        userId,
        movieId,
        rating: Number(rating),
        review: userRating.review,
        timestamp: userRating.timestamp,
        worldcoinProof: userRating.worldcoinProof,
        vlayerProof: userRating.vlayerProof,
        verified: userRating.verified,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Created new rating for user ${userId} on movie ${movieId}`);
      return NextResponse.json({
        success: true,
        message: "Rating saved successfully",
        rating: userRating,
      });
    }
  } catch (error) {
    console.error("❌ Error saving user rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const movieId = searchParams.get("movieId");

    console.log("🔍 GET /api/user-ratings - userId:", userId, "movieId:", movieId);

    let ratings: any[] = [];

    if (userId && movieId) {
      // Get specific rating
      console.log("🔍 Fetching specific rating for user:", userId, "movie:", movieId);
      const rating = await DatabaseService.getUserRating(userId, movieId);
      console.log("📋 Database response:", rating);
      ratings = rating ? [rating] : [];
    } else if (userId) {
      // Get all ratings for a user
      console.log("🔍 Fetching all ratings for user:", userId);
      ratings = await DatabaseService.getUserRatings(userId);
    } else {
      // Get all ratings (you might want to add pagination here)
      // For now, we'll return empty array since there's no method to get all ratings
      ratings = [];
    }

    console.log("📋 Returning ratings:", ratings);

    return NextResponse.json({
      success: true,
      ratings,
      count: ratings.length,
    });
  } catch (error) {
    console.error("❌ Error fetching user ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 