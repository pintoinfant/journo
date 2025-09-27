import clientPromise from "./mongodb";

export interface Movie {
  movieId: string;
  name: string;
  description: string;
  revenue?: number;
  budget?: number;
  genres: string[];
  votersCount?: number;
  votersAvg?: number;
  journoRating?: number;
  normalizedRating?: number;
  year?: number;
  director?: string;
  runtime?: number;
  duration?: string;
  poster?: string;
  rating?: number;
  cast?: string[];
  awards?: string[];
  ens?: string;
  id?: string;
  title?: string;
}

export interface User {
  userId: string;
  worldId: string;
  email: string;
  phone: string;
  profile: {
    name: string;
    bio: string;
    photo: string;
    location: string;
    languages: string[];
    verificationLevel: 'device' | 'orb' | 'orb+';
  };
  createdAt: Date;
  isHost: boolean;
  isDriver: boolean;
}

export interface Genre {
  name: string;
}

export interface UserGenre {
  userId: string;
  genreId: string;
}

export interface Listing {
  _id?: string;
  hostId: string;
  type: 'couch' | 'private_room' | 'entire_place';
  title: string;
  description: string;
  photos: string[];
  location: {
    address: string;
    coordinates: [number, number];
  };
  price: number;
  availability: {
    date: Date;
    available: boolean;
  }[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  _id?: string;
  guestId: string;
  listingId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  totalPrice: number;
  transactionHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ride {
  _id?: string;
  driverId: string;
  from: {
    address: string;
    coordinates: [number, number];
  };
  to: {
    address: string;
    coordinates: [number, number];
  };
  date: Date;
  time: string;
  seats: number;
  price: number;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  passengers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RideRequest {
  _id?: string;
  rideId: string;
  passengerId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieGenre {
  movieId: string;
  genreId: string;
}

export interface UserRating {
  userId: string;
  movieId: string;
  rating: number;
  review?: string;
  timestamp: Date;
  worldcoinProof?: string | null;
  vlayerProof?: string | null;
  verified: boolean;
  emotion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DatabaseService {
  private static async getDb() {
    const client = await clientPromise;
    return client.db("journo");
  }

  // Movie operations - now using centralized movie data
  static async getMovies(): Promise<Movie[]> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .find({})
      .toArray()) as unknown as Movie[];
  }

  static async getMovie(movieId: string): Promise<Movie | null> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .findOne({ movieId })) as unknown as Movie | null;
  }

  static async createMovie(movie: Movie): Promise<void> {
    const db = await this.getDb();
    await db.collection("movies").insertOne(movie);
  }

  static async updateMovie(
    movieId: string,
    updateData: Partial<Movie>
  ): Promise<void> {
    const db = await this.getDb();
    await db.collection("movies").updateOne({ movieId }, { $set: updateData });
  }

  static async deleteMovie(movieId: string): Promise<void> {
    const db = await this.getDb();
    await db.collection("movies").deleteOne({ movieId });
  }

  // User operations
  static async getUsers(): Promise<User[]> {
    const db = await this.getDb();
    return (await db
      .collection("users")
      .find({})
      .toArray()) as unknown as User[];
  }

  static async getUser(userId: string): Promise<User | null> {
    const db = await this.getDb();
    return (await db
      .collection("users")
      .findOne({ userId })) as unknown as User | null;
  }

  static async createUser(user: User): Promise<void> {
    const db = await this.getDb();
    await db.collection("users").insertOne(user);
  }

  static async updateUser(
    userId: string,
    updateData: Partial<User>
  ): Promise<void> {
    const db = await this.getDb();
    await db.collection("users").updateOne({ userId }, { $set: updateData });
  }

  static async deleteUser(userId: string): Promise<void> {
    const db = await this.getDb();
    await db.collection("users").deleteOne({ userId });
  }

  // Genre operations - now using centralized movie data
  static async getGenres(): Promise<Genre[]> {
    const db = await this.getDb();
    return (await db
      .collection("genres")
      .find({})
      .toArray()) as unknown as Genre[];
  }

  static async createGenre(genre: Genre): Promise<void> {
    const db = await this.getDb();
    await db.collection("genres").insertOne(genre);
  }

  // User Genre operations
  static async getUserGenres(userId: string): Promise<UserGenre[]> {
    const db = await this.getDb();
    return (await db
      .collection("usersGenres")
      .find({ userId })
      .toArray()) as unknown as UserGenre[];
  }

  static async createUserGenre(userGenre: UserGenre): Promise<void> {
    const db = await this.getDb();
    await db.collection("usersGenres").insertOne(userGenre);
  }

  static async deleteUserGenre(userId: string, genreId: string): Promise<void> {
    const db = await this.getDb();
    await db.collection("usersGenres").deleteOne({ userId, genreId });
  }

  // Movie Genre operations - now using centralized movie data
  static async getMovieGenres(movieId: string): Promise<MovieGenre[]> {
    const db = await this.getDb();
    return (await db
      .collection("moviesGenres")
      .find({ movieId })
      .toArray()) as unknown as MovieGenre[];
  }

  static async createMovieGenre(movieGenre: MovieGenre): Promise<void> {
    const db = await this.getDb();
    await db.collection("moviesGenres").insertOne(movieGenre);
  }

  static async deleteMovieGenre(
    movieId: string,
    genreId: string
  ): Promise<void> {
    const db = await this.getDb();
    await db.collection("moviesGenres").deleteOne({ movieId, genreId });
  }

  // User Rating operations
  static async getUserRatings(userId: string): Promise<UserRating[]> {
    const db = await this.getDb();
    return (await db
      .collection("userRatings")
      .find({ userId })
      .toArray()) as unknown as UserRating[];
  }

  static async getUserRating(
    userId: string,
    movieId: string
  ): Promise<UserRating | null> {
    const db = await this.getDb();
    console.log(
      "🔍 DatabaseService.getUserRating - userId:",
      userId,
      "movieId:",
      movieId
    );
    const result = (await db
      .collection("userRatings")
      .findOne({ userId, movieId })) as unknown as UserRating | null;
    console.log("📋 DatabaseService.getUserRating result:", result);
    return result;
  }

  static async createUserRating(userRating: UserRating): Promise<void> {
    const db = await this.getDb();
    await db.collection("userRatings").insertOne(userRating);
  }

  static async updateUserRating(
    userId: string,
    movieId: string,
    updateData: Partial<UserRating>
  ): Promise<void> {
    const db = await this.getDb();
    await db
      .collection("userRatings")
      .updateOne({ userId, movieId }, { $set: updateData });
  }

  static async deleteUserRating(
    userId: string,
    movieId: string
  ): Promise<void> {
    const db = await this.getDb();
    await db.collection("userRatings").deleteOne({ userId, movieId });
  }

  // Advanced queries - now using centralized movie data
  static async getMoviesByGenre(genre: string): Promise<Movie[]> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .find({ genres: genre })
      .toArray()) as unknown as Movie[];
  }

  static async getMoviesByRating(minRating: number): Promise<Movie[]> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .find({ journoRating: { $gte: minRating } })
      .toArray()) as unknown as Movie[];
  }

  static async searchMovies(query: string): Promise<Movie[]> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .toArray()) as unknown as Movie[];
  }

  static async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    const db = await this.getDb();
    return (await db
      .collection("movies")
      .find({})
      .sort({ journoRating: -1 })
      .limit(limit)
      .toArray()) as unknown as Movie[];
  }

  static async getMoviesByUserPreferences(userId: string): Promise<Movie[]> {
    const db = await this.getDb();

    // Get user's preferred genres
    const userGenres = await this.getUserGenres(userId);
    const genreIds = userGenres.map((ug) => ug.genreId);

    // Get genre names - using name field instead of _id for simplicity
    const genres = (await db
      .collection("genres")
      .find({ name: { $in: genreIds } })
      .toArray()) as unknown as Genre[];
    const genreNames = genres.map((g) => g.name);

    // Get movies that match user's preferred genres
    return (await db
      .collection("movies")
      .find({
        genres: { $in: genreNames },
      })
      .toArray()) as unknown as Movie[];
  }

  // Helper methods for graph data and other operations
  static async getAllMovies(): Promise<Movie[]> {
    return MovieService.getAllMovies();
  }

  static async getAllUsers(): Promise<User[]> {
    return this.getUsers();
  }

  static async getAllGenres(): Promise<Genre[]> {
    return this.getGenres();
  }

  static async getAllUserRatings(): Promise<UserRating[]> {
    const db = await this.getDb();
    return (await db
      .collection("userRatings")
      .find({})
      .toArray()) as unknown as UserRating[];
  }

  static async getAllUserGenres(): Promise<UserGenre[]> {
    const db = await this.getDb();
    return (await db
      .collection("usersGenres")
      .find({})
      .toArray()) as unknown as UserGenre[];
  }

  // Listing operations
  static async createListing(listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection("listings").insertOne({
      ...listing,
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  }

  static async getListings(): Promise<Listing[]> {
    const db = await this.getDb();
    return (await db
      .collection("listings")
      .find({})
      .toArray()) as unknown as Listing[];
  }

  static async getListing(listingId: string): Promise<Listing | null> {
    const db = await this.getDb();
    return (await db
      .collection("listings")
      .findOne({ _id: listingId })) as unknown as Listing | null;
  }

  static async getListingsByHost(hostId: string): Promise<Listing[]> {
    const db = await this.getDb();
    return (await db
      .collection("listings")
      .find({ hostId })
      .toArray()) as unknown as Listing[];
  }

  static async searchListings(query: string, location?: string): Promise<Listing[]> {
    const db = await this.getDb();
    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };
    
    if (location) {
      searchQuery["location.address"] = { $regex: location, $options: "i" };
    }
    
    return (await db
      .collection("listings")
      .find(searchQuery)
      .toArray()) as unknown as Listing[];
  }

  // Booking operations
  static async createBooking(booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection("bookings").insertOne({
      ...booking,
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  }

  static async getBookingsByGuest(guestId: string): Promise<Booking[]> {
    const db = await this.getDb();
    return (await db
      .collection("bookings")
      .find({ guestId })
      .toArray()) as unknown as Booking[];
  }

  static async getBookingsByHost(hostId: string): Promise<Booking[]> {
    const db = await this.getDb();
    return (await db
      .collection("bookings")
      .aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listingId",
            foreignField: "_id",
            as: "listing"
          }
        },
        {
          $match: {
            "listing.hostId": hostId
          }
        }
      ])
      .toArray()) as unknown as Booking[];
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    const db = await this.getDb();
    await db.collection("bookings").updateOne(
      { _id: bookingId },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  // Ride operations
  static async createRide(ride: Omit<Ride, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection("rides").insertOne({
      ...ride,
      passengers: [],
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  }

  static async getRides(): Promise<Ride[]> {
    const db = await this.getDb();
    return (await db
      .collection("rides")
      .find({ status: 'active' })
      .toArray()) as unknown as Ride[];
  }

  static async getRide(rideId: string): Promise<Ride | null> {
    const db = await this.getDb();
    return (await db
      .collection("rides")
      .findOne({ _id: rideId })) as unknown as Ride | null;
  }

  static async searchRides(from?: string, to?: string, date?: Date): Promise<Ride[]> {
    const db = await this.getDb();
    const query: any = { status: 'active' };
    
    if (from) {
      query["from.address"] = { $regex: from, $options: "i" };
    }
    if (to) {
      query["to.address"] = { $regex: to, $options: "i" };
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    return (await db
      .collection("rides")
      .find(query)
      .toArray()) as unknown as Ride[];
  }

  // Ride request operations
  static async createRideRequest(request: Omit<RideRequest, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = await this.getDb();
    const now = new Date();
    const result = await db.collection("rideRequests").insertOne({
      ...request,
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  }

  static async getRideRequestsByRide(rideId: string): Promise<RideRequest[]> {
    const db = await this.getDb();
    return (await db
      .collection("rideRequests")
      .find({ rideId })
      .toArray()) as unknown as RideRequest[];
  }

  static async updateRideRequestStatus(requestId: string, status: RideRequest['status']): Promise<void> {
    const db = await this.getDb();
    await db.collection("rideRequests").updateOne(
      { _id: requestId },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  // Aggregation pipeline method
  static async aggregate(
    collection: string,
    pipeline: object[]
  ): Promise<unknown[]> {
    const db = await this.getDb();
    return await db.collection(collection).aggregate(pipeline).toArray();
  }
}
