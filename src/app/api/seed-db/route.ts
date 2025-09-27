import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function POST(_request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    console.log("🌱 Starting database seeding...");

    // Sample genres
    const genres = [
      { name: "Drama", description: "Dramatic films" },
      { name: "Crime", description: "Crime and detective films" },
      { name: "Action", description: "Action and adventure films" },
      { name: "Adventure", description: "Adventure and exploration films" },
      { name: "Comedy", description: "Comedy and humor films" },
      { name: "Romance", description: "Romantic films" },
      { name: "SciFi", description: "Science fiction films" },
      { name: "Thriller", description: "Thriller and suspense films" },
      { name: "Documentary", description: "Documentary films" },
      { name: "Animation", description: "Animated films" },
    ];

    // Sample movies with detailed data
    const movies = [
      {
        movieId: "movie001",
        name: "Inception",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        revenue: 836836967,
        budget: 160000000,
        genres: ["Action", "SciFi", "Thriller"],
        votersCount: 2500000,
        votersAvg: 8.8,
        journoRating: 8.5,
        normalizedRating: 8.2,
        year: 2010,
        director: "Christopher Nolan",
        poster:
          "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      },
      {
        movieId: "movie002",
        name: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        revenue: 1004558444,
        budget: 185000000,
        genres: ["Action", "Crime", "Drama"],
        votersCount: 2800000,
        votersAvg: 9.0,
        journoRating: 8.9,
        normalizedRating: 8.7,
        year: 2008,
        director: "Christopher Nolan",
        poster:
          "https://image.tmdb.org/t/p/w500/qJ2tW6WMGOux4YdVDoKxRq0MsqO.jpg",
      },
      {
        movieId: "movie003",
        name: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        revenue: 213928762,
        budget: 8000000,
        genres: ["Crime", "Drama"],
        votersCount: 2100000,
        votersAvg: 8.9,
        journoRating: 8.7,
        normalizedRating: 8.5,
        year: 1994,
        director: "Quentin Tarantino",
        poster:
          "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      },
      {
        movieId: "movie004",
        name: "Avatar",
        description:
          "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
        revenue: 2847246203,
        budget: 237000000,
        genres: ["Action", "Adventure", "SciFi"],
        votersCount: 1200000,
        votersAvg: 7.5,
        journoRating: 7.2,
        normalizedRating: 7.0,
        year: 2009,
        director: "James Cameron",
        poster:
          "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      },
      {
        movieId: "movie005",
        name: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        revenue: 677463813,
        budget: 165000000,
        genres: ["Adventure", "Drama", "SciFi"],
        votersCount: 1800000,
        votersAvg: 8.6,
        journoRating: 8.3,
        normalizedRating: 8.1,
        year: 2014,
        director: "Christopher Nolan",
        poster:
          "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      },
      {
        movieId: "movie006",
        name: "The Matrix",
        description:
          "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
        revenue: 463517383,
        budget: 63000000,
        genres: ["Action", "SciFi"],
        votersCount: 1900000,
        votersAvg: 8.7,
        journoRating: 8.4,
        normalizedRating: 8.2,
        year: 1999,
        director: "Lana Wachowski",
        poster:
          "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      },
      {
        movieId: "movie007",
        name: "Forrest Gump",
        description:
          "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        revenue: 677945399,
        budget: 55000000,
        genres: ["Drama", "Romance"],
        votersCount: 2200000,
        votersAvg: 8.8,
        journoRating: 8.6,
        normalizedRating: 8.4,
        year: 1994,
        director: "Robert Zemeckis",
        poster:
          "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
      },
      {
        movieId: "movie008",
        name: "Goodfellas",
        description:
          "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
        revenue: 46836394,
        budget: 25000000,
        genres: ["Crime", "Drama"],
        votersCount: 1100000,
        votersAvg: 8.7,
        journoRating: 8.5,
        normalizedRating: 8.3,
        year: 1990,
        director: "Martin Scorsese",
        poster:
          "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
      },
      {
        movieId: "movie009",
        name: "Gladiator",
        description:
          "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
        revenue: 460583960,
        budget: 103000000,
        genres: ["Action", "Adventure", "Drama"],
        votersCount: 1500000,
        votersAvg: 8.5,
        journoRating: 8.2,
        normalizedRating: 8.0,
        year: 2000,
        director: "Ridley Scott",
        poster:
          "https://image.tmdb.org/t/p/w500/6WBI9C1xfeNGGBkD2v6EMCF3u6.jpg",
      },
      {
        movieId: "movie010",
        name: "Titanic",
        description:
          "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        revenue: 2201647264,
        budget: 200000000,
        genres: ["Drama", "Romance"],
        votersCount: 1100000,
        votersAvg: 7.9,
        journoRating: 7.6,
        normalizedRating: 7.4,
        year: 1997,
        director: "James Cameron",
        poster:
          "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      },
    ];

    // Sample users
    const users = [
      {
        userId: "user001",
        name: "Alex Chen",
        email: "alex@example.com",
        joinDate: new Date("2023-01-15"),
      },
      {
        userId: "user002",
        name: "Sam Johnson",
        email: "sam@example.com",
        joinDate: new Date("2023-02-20"),
      },
      {
        userId: "user003",
        name: "Jordan Smith",
        email: "jordan@example.com",
        joinDate: new Date("2023-03-10"),
      },
      {
        userId: "user004",
        name: "Casey Brown",
        email: "casey@example.com",
        joinDate: new Date("2023-04-05"),
      },
      {
        userId: "user005",
        name: "Taylor Davis",
        email: "taylor@example.com",
        joinDate: new Date("2023-05-12"),
      },
    ];

    // Sample user ratings with emotions
    const userRatings = [
      // User 1 ratings
      {
        userId: "user001",
        movieId: "movie001",
        rating: 9,
        review:
          "Mind-bending masterpiece! The concept of dream infiltration is executed perfectly.",
        timestamp: new Date("2023-06-15"),
        worldcoinProof: "proof_123",
        vlayerProof: "vlayer_proof_456",
        verified: true,
        emotion: "excited",
        createdAt: new Date("2023-06-15"),
        updatedAt: new Date("2023-06-15"),
      },
      {
        userId: "user001",
        movieId: "movie002",
        rating: 10,
        review: "Heath Ledger's Joker is absolutely terrifying and brilliant.",
        timestamp: new Date("2023-07-20"),
        worldcoinProof: "proof_124",
        vlayerProof: "vlayer_proof_457",
        verified: true,
        emotion: "excited",
        createdAt: new Date("2023-07-20"),
        updatedAt: new Date("2023-07-20"),
      },
      {
        userId: "user001",
        movieId: "movie003",
        rating: 8,
        review: "Quirky and violent, but undeniably influential.",
        timestamp: new Date("2023-08-10"),
        worldcoinProof: "proof_125",
        vlayerProof: "vlayer_proof_458",
        verified: true,
        emotion: "happy",
        createdAt: new Date("2023-08-10"),
        updatedAt: new Date("2023-08-10"),
      },

      // User 2 ratings
      {
        userId: "user002",
        movieId: "movie001",
        rating: 8,
        review: "Complex but rewarding. The visual effects are groundbreaking.",
        timestamp: new Date("2023-06-18"),
        worldcoinProof: "proof_126",
        vlayerProof: "vlayer_proof_459",
        verified: true,
        emotion: "calm",
        createdAt: new Date("2023-06-18"),
        updatedAt: new Date("2023-06-18"),
      },
      {
        userId: "user002",
        movieId: "movie004",
        rating: 7,
        review: "Visually stunning but the story is a bit thin.",
        timestamp: new Date("2023-07-25"),
        worldcoinProof: "proof_127",
        vlayerProof: "vlayer_proof_460",
        verified: true,
        emotion: "neutral",
        createdAt: new Date("2023-07-25"),
        updatedAt: new Date("2023-07-25"),
      },
      {
        userId: "user002",
        movieId: "movie005",
        rating: 9,
        review: "Emotional and scientifically accurate. The ending is perfect.",
        timestamp: new Date("2023-08-15"),
        worldcoinProof: "proof_128",
        vlayerProof: "vlayer_proof_461",
        verified: true,
        emotion: "sad",
        createdAt: new Date("2023-08-15"),
        updatedAt: new Date("2023-08-15"),
      },

      // User 3 ratings
      {
        userId: "user003",
        movieId: "movie002",
        rating: 9,
        review: "Dark, complex, and perfectly executed. A true masterpiece.",
        timestamp: new Date("2023-07-22"),
        worldcoinProof: "proof_129",
        vlayerProof: "vlayer_proof_462",
        verified: true,
        emotion: "excited",
        createdAt: new Date("2023-07-22"),
        updatedAt: new Date("2023-07-22"),
      },
      {
        userId: "user003",
        movieId: "movie006",
        rating: 8,
        review:
          "Revolutionary for its time. The bullet time effect changed cinema.",
        timestamp: new Date("2023-08-05"),
        worldcoinProof: "proof_130",
        vlayerProof: "vlayer_proof_463",
        verified: true,
        emotion: "excited",
        createdAt: new Date("2023-08-05"),
        updatedAt: new Date("2023-08-05"),
      },
      {
        userId: "user003",
        movieId: "movie007",
        rating: 7,
        review: "Heartwarming story with great performances.",
        timestamp: new Date("2023-09-01"),
        worldcoinProof: "proof_131",
        vlayerProof: "vlayer_proof_464",
        verified: true,
        emotion: "happy",
        createdAt: new Date("2023-09-01"),
        updatedAt: new Date("2023-09-01"),
      },

      // User 4 ratings
      {
        userId: "user004",
        movieId: "movie003",
        rating: 9,
        review: "Tarantino at his best. The dialogue is razor-sharp.",
        timestamp: new Date("2023-08-12"),
        worldcoinProof: "proof_132",
        vlayerProof: "vlayer_proof_465",
        verified: true,
        emotion: "happy",
        createdAt: new Date("2023-08-12"),
        updatedAt: new Date("2023-08-12"),
      },
      {
        userId: "user004",
        movieId: "movie008",
        rating: 8,
        review: "Gritty and realistic portrayal of mob life.",
        timestamp: new Date("2023-09-10"),
        worldcoinProof: "proof_133",
        vlayerProof: "vlayer_proof_466",
        verified: true,
        emotion: "calm",
        createdAt: new Date("2023-09-10"),
        updatedAt: new Date("2023-09-10"),
      },
      {
        userId: "user004",
        movieId: "movie009",
        rating: 7,
        review: "Epic scale with great action sequences.",
        timestamp: new Date("2023-10-05"),
        worldcoinProof: "proof_134",
        vlayerProof: "vlayer_proof_467",
        verified: true,
        emotion: "excited",
        createdAt: new Date("2023-10-05"),
        updatedAt: new Date("2023-10-05"),
      },

      // User 5 ratings
      {
        userId: "user005",
        movieId: "movie004",
        rating: 6,
        review: "Beautiful visuals but the story is predictable.",
        timestamp: new Date("2023-07-28"),
        worldcoinProof: "proof_135",
        vlayerProof: "vlayer_proof_468",
        verified: true,
        emotion: "neutral",
        createdAt: new Date("2023-07-28"),
        updatedAt: new Date("2023-07-28"),
      },
      {
        userId: "user005",
        movieId: "movie005",
        rating: 8,
        review: "Complex and emotional. The science is well-researched.",
        timestamp: new Date("2023-08-20"),
        worldcoinProof: "proof_136",
        vlayerProof: "vlayer_proof_469",
        verified: true,
        emotion: "sad",
        createdAt: new Date("2023-08-20"),
        updatedAt: new Date("2023-08-20"),
      },
      {
        userId: "user005",
        movieId: "movie010",
        rating: 7,
        review: "Classic love story with great production value.",
        timestamp: new Date("2023-09-15"),
        worldcoinProof: "proof_137",
        vlayerProof: "vlayer_proof_470",
        verified: true,
        emotion: "sad",
        createdAt: new Date("2023-09-15"),
        updatedAt: new Date("2023-09-15"),
      },
    ];

    // User genre preferences
    const userGenres = [
      { userId: "user001", genreId: "Action" },
      { userId: "user001", genreId: "SciFi" },
      { userId: "user001", genreId: "Thriller" },
      { userId: "user002", genreId: "Drama" },
      { userId: "user002", genreId: "Adventure" },
      { userId: "user002", genreId: "SciFi" },
      { userId: "user003", genreId: "Action" },
      { userId: "user003", genreId: "Crime" },
      { userId: "user003", genreId: "Drama" },
      { userId: "user004", genreId: "Crime" },
      { userId: "user004", genreId: "Drama" },
      { userId: "user004", genreId: "Action" },
      { userId: "user005", genreId: "Drama" },
      { userId: "user005", genreId: "Romance" },
      { userId: "user005", genreId: "SciFi" },
    ];

    // Movie genre relationships
    const movieGenres = [
      // Inception
      { movieId: "movie001", genreId: "Action" },
      { movieId: "movie001", genreId: "SciFi" },
      { movieId: "movie001", genreId: "Thriller" },
      // The Dark Knight
      { movieId: "movie002", genreId: "Action" },
      { movieId: "movie002", genreId: "Crime" },
      { movieId: "movie002", genreId: "Drama" },
      // Pulp Fiction
      { movieId: "movie003", genreId: "Crime" },
      { movieId: "movie003", genreId: "Drama" },
      // Avatar
      { movieId: "movie004", genreId: "Action" },
      { movieId: "movie004", genreId: "Adventure" },
      { movieId: "movie004", genreId: "SciFi" },
      // Interstellar
      { movieId: "movie005", genreId: "Adventure" },
      { movieId: "movie005", genreId: "Drama" },
      { movieId: "movie005", genreId: "SciFi" },
      // The Matrix
      { movieId: "movie006", genreId: "Action" },
      { movieId: "movie006", genreId: "SciFi" },
      // Forrest Gump
      { movieId: "movie007", genreId: "Drama" },
      { movieId: "movie007", genreId: "Romance" },
      // Goodfellas
      { movieId: "movie008", genreId: "Crime" },
      { movieId: "movie008", genreId: "Drama" },
      // Gladiator
      { movieId: "movie009", genreId: "Action" },
      { movieId: "movie009", genreId: "Adventure" },
      { movieId: "movie009", genreId: "Drama" },
      // Titanic
      { movieId: "movie010", genreId: "Drama" },
      { movieId: "movie010", genreId: "Romance" },
    ];

    console.log("📝 Inserting genres...");
    for (const genre of genres) {
      await DatabaseService.createGenre(genre);
    }

    console.log("🎬 Inserting movies...");
    for (const movie of movies) {
      await DatabaseService.createMovie(movie);
    }

    console.log("👥 Inserting users...");
    for (const user of users) {
      await DatabaseService.createUser(user);
    }

    console.log("⭐ Inserting user ratings...");
    for (const rating of userRatings) {
      await DatabaseService.createUserRating(rating);
    }

    console.log("🎭 Inserting user genre preferences...");
    for (const userGenre of userGenres) {
      await DatabaseService.createUserGenre(userGenre);
    }

    console.log("🎬 Inserting movie genre relationships...");
    for (const movieGenre of movieGenres) {
      await DatabaseService.createMovieGenre(movieGenre);
    }

    console.log("✅ Database seeding completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        genres: genres.length,
        movies: movies.length,
        users: users.length,
        ratings: userRatings.length,
        userGenres: userGenres.length,
        movieGenres: movieGenres.length,
      },
    });
  } catch (error) {
    console.error("❌ Database seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Build complex aggregation pipeline for calculating new journo scores
    const pipeline: object[] = [];

    // Stage 1: Start with movies and add genre-based user preferences
    pipeline.push({
      $lookup: {
        from: "moviesGenres",
        localField: "movieId",
        foreignField: "movieId",
        as: "movieGenres",
      },
    });

    // Stage 2: Find users who have preferences for these genres
    pipeline.push({
      $lookup: {
        from: "usersGenres",
        localField: "movieGenres.genreId",
        foreignField: "genreId",
        as: "interestedUsers",
      },
    });

    // Stage 3: Get all ratings from these interested users
    pipeline.push({
      $lookup: {
        from: "userRatings",
        localField: "interestedUsers.userId",
        foreignField: "userId",
        as: "userRatings",
      },
    });

    // Stage 4: Get specific ratings for this movie
    pipeline.push({
      $lookup: {
        from: "userRatings",
        localField: "movieId",
        foreignField: "movieId",
        as: "thisMovieRatings",
      },
    });

    // Stage 5: Calculate new journo score based on genre preferences and correlation
    pipeline.push({
      $addFields: {
        newRatings: {
          $let: {
            vars: {
              // Get unique interested users
              interestedUserIds: {
                $setUnion: ["$interestedUsers.userId", []],
              },
              // Get ratings for this movie from interested users
              relevantRatings: {
                $filter: {
                  input: "$thisMovieRatings",
                  as: "rating",
                  cond: {
                    $in: ["$$rating.userId", "$interestedUsers.userId"],
                  },
                },
              },
            },
            in: {
              $cond: {
                if: { $gt: [{ $size: "$$relevantRatings" }, 0] },
                then: {
                  $let: {
                    vars: {
                      // Calculate weighted average based on user genre preference strength
                      weightedSum: {
                        $reduce: {
                          input: "$$relevantRatings",
                          initialValue: 0,
                          in: {
                            $add: [
                              "$$value",
                              {
                                $multiply: [
                                  "$$this.rating",
                                  // Weight based on how many genres the user likes from this movie
                                  {
                                    $divide: [
                                      {
                                        $size: {
                                          $setIntersection: [
                                            "$genres",
                                            {
                                              $map: {
                                                input: {
                                                  $filter: {
                                                    input: "$interestedUsers",
                                                    as: "user",
                                                    cond: {
                                                      $eq: [
                                                        "$$user.userId",
                                                        "$$this.userId",
                                                      ],
                                                    },
                                                  },
                                                },
                                                as: "userGenre",
                                                in: "$$userGenre.genreId",
                                              },
                                            },
                                          ],
                                        },
                                      },
                                      { $size: "$genres" },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                      totalWeight: {
                        $reduce: {
                          input: "$$relevantRatings",
                          initialValue: 0,
                          in: {
                            $add: [
                              "$$value",
                              {
                                $divide: [
                                  {
                                    $size: {
                                      $setIntersection: [
                                        "$genres",
                                        {
                                          $map: {
                                            input: {
                                              $filter: {
                                                input: "$interestedUsers",
                                                as: "user",
                                                cond: {
                                                  $eq: [
                                                    "$$user.userId",
                                                    "$$this.userId",
                                                  ],
                                                },
                                              },
                                            },
                                            as: "userGenre",
                                            in: "$$userGenre.genreId",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  { $size: "$genres" },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    },
                    in: {
                      $cond: {
                        if: { $gt: ["$$totalWeight", 0] },
                        then: {
                          $round: [
                            {
                              $divide: ["$$weightedSum", "$$totalWeight"],
                            },
                            2,
                          ],
                        },
                        else: "$journoRating",
                      },
                    },
                  },
                },
                else: "$journoRating", // Fallback to original rating if no relevant ratings
              },
            },
          },
        },
        // Add additional analytics
        ratingAnalytics: {
          $let: {
            vars: {
              relevantRatings: {
                $filter: {
                  input: "$thisMovieRatings",
                  as: "rating",
                  cond: {
                    $in: ["$$rating.userId", "$interestedUsers.userId"],
                  },
                },
              },
            },
            in: {
              totalRelevantRatings: { $size: "$$relevantRatings" },
              interestedUsersCount: {
                $size: { $setUnion: ["$interestedUsers.userId", []] },
              },
              averageRatingFromInterestedUsers: {
                $cond: {
                  if: { $gt: [{ $size: "$$relevantRatings" }, 0] },
                  then: {
                    $round: [{ $avg: "$$relevantRatings.rating" }, 2],
                  },
                  else: null,
                },
              },
            },
          },
        },
      },
    });

    // Stage 6: Clean up and project final fields
    pipeline.push({
      $project: {
        movieId: 1,
        name: 1,
        description: 1,
        genres: 1,
        year: 1,
        director: 1,
        poster: 1,
        revenue: 1,
        budget: 1,
        votersCount: 1,
        votersAvg: 1,
        journoRating: 1,
        normalizedRating: 1,
        newRatings: 1,
        ratingAnalytics: 1,
      },
    });

    // Stage 7: Sort by new ratings descending
    pipeline.push({
      $sort: { newRatings: -1 },
    });

    // Execute aggregation pipeline
    const movies = await DatabaseService.aggregate("movies", pipeline);

    return NextResponse.json({
      success: true,
      data: movies,
      count: movies.length,
      message:
        "Movies with new journo scores calculated based on genre preferences and user correlation",
    });
  } catch (error) {
    console.error("Error fetching movies with new journo scores:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
