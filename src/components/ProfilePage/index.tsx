"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Film,
  Clock,
  TrendingUp,
  Lock,
  Eye,
  List,
  BarChart3,
  Trophy,
  Award,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface UserStats {
  totalRatings: number;
  weightedRatings: number;
  unweightedRatings: number;
  averageRating: number;
  totalWatchTime: number;
  favoriteGenres: string[];
  ratingDistribution: { [key: number]: number };
}

interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string[];
  poster: string;
  userRating: number;
  dateRated: string;
  ensSubname: string;
}

interface WatchList {
  id: string;
  name: string;
  movies: Movie[];
  createdAt: string;
}

const SAMPLE_STATS: UserStats = {
  totalRatings: 47,
  weightedRatings: 42,
  unweightedRatings: 5,
  averageRating: 4.2,
  totalWatchTime: 4800, // minutes
  favoriteGenres: ["Drama", "Thriller", "Sci-Fi"],
  ratingDistribution: { 1: 2, 2: 3, 3: 8, 4: 15, 5: 19 },
};

const SAMPLE_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    poster: "/api/placeholder/300/450",
    userRating: 5,
    dateRated: "2024-01-15",
    ensSubname: "pulpfiction.journo.ens",
  },
  {
    id: "2",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    poster: "/api/placeholder/300/450",
    userRating: 5,
    dateRated: "2024-01-12",
    ensSubname: "darkknight.journo.ens",
  },
  {
    id: "3",
    title: "Goodfellas",
    year: 1990,
    director: "Martin Scorsese",
    genre: ["Biography", "Crime", "Drama"],
    poster: "/api/placeholder/300/450",
    userRating: 4,
    dateRated: "2024-01-10",
    ensSubname: "goodfellas.journo.ens",
  },
  {
    id: "4",
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    genre: ["Drama", "Romance"],
    poster: "/api/placeholder/300/450",
    userRating: 4,
    dateRated: "2024-01-08",
    ensSubname: "forrestgump.journo.ens",
  },
];

const SAMPLE_WATCHLISTS: WatchList[] = [
  {
    id: "1",
    name: "To Watch",
    movies: SAMPLE_MOVIES.slice(0, 2),
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Favorites",
    movies: SAMPLE_MOVIES.slice(2, 4),
    createdAt: "2024-01-05",
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card p-6 text-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
}

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
}

function MovieCard({ movie, showRating = true }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {showRating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-80 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-bold">
              {movie.userRating}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-3">
          <h4 className="text-white text-sm font-semibold truncate">
            {movie.title}
          </h4>
          <p className="text-gray-300 text-xs">{movie.year}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface RatingDistributionProps {
  distribution: { [key: number]: number };
}

function RatingDistribution({ distribution }: RatingDistributionProps) {
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center gap-3">
          <div className="flex items-center gap-1 w-12">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm">{rating}</span>
          </div>
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(distribution[rating] / maxCount) * 100}%` }}
              transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
              className="bg-yellow-400 h-2 rounded-full"
            />
          </div>
          <span className="text-gray-400 text-sm w-8 text-right">
            {distribution[rating]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"stats" | "rated" | "watchlists">(
    "stats"
  );
  const [stats, setStats] = useState<UserStats>(SAMPLE_STATS);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [watchlists, setWatchlists] = useState<WatchList[]>(SAMPLE_WATCHLISTS);
  const [graphUnlocked, setGraphUnlocked] = useState(false);

  useEffect(() => {
    // Check if user has rated 10+ movies to unlock graph
    setGraphUnlocked(stats.unweightedRatings >= 10);
  }, [stats.unweightedRatings]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-black text-2xl font-bold">
                {session?.user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {session?.user?.username || "User"}
                </h1>
                <div className="bg-blue-500 px-2 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">
                    World ID
                  </span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Member since{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-yellow-400 text-lg font-bold">
                    {stats.totalRatings}
                  </p>
                  <p className="text-gray-400 text-sm">Total Ratings</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 text-lg font-bold">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <p className="text-gray-400 text-sm">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 text-lg font-bold">
                    {Math.round(stats.totalWatchTime / 60)}h
                  </p>
                  <p className="text-gray-400 text-sm">Watch Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex gap-8 border-b border-gray-800 mb-8">
          {[
            {
              id: "stats",
              label: "Stats",
              icon: <BarChart3 className="w-5 h-5" />,
            },
            {
              id: "rated",
              label: "Rated Movies",
              icon: <Star className="w-5 h-5" />,
            },
            {
              id: "watchlists",
              label: "Watchlists",
              icon: <List className="w-5 h-5" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 px-2 transition-colors ${activeTab === tab.id
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Weighted Ratings"
                  value={stats.weightedRatings}
                  subtitle="Verified with vLayer"
                  icon={<Trophy className="w-6 h-6 text-white" />}
                  color="bg-yellow-500"
                />
                <StatCard
                  title="Unweighted Ratings"
                  value={stats.unweightedRatings}
                  subtitle="Without verification"
                  icon={<Star className="w-6 h-6 text-white" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Watch Time"
                  value={`${Math.round(stats.totalWatchTime / 60)}h`}
                  subtitle={`${stats.totalWatchTime} minutes`}
                  icon={<Clock className="w-6 h-6 text-white" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Avg Rating"
                  value={stats.averageRating.toFixed(1)}
                  subtitle="Out of 5 stars"
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  color="bg-purple-500"
                />
              </div>

              {/* Rating Distribution */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Rating Distribution
                </h3>
                <RatingDistribution distribution={stats.ratingDistribution} />
              </div>

              {/* Graph Section */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                  Advanced Analytics
                </h3>

                {graphUnlocked ? (
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <div className="text-yellow-400 mb-4">
                      <BarChart3 className="w-16 h-16 mx-auto" />
                    </div>
                    <h4 className="text-white text-xl font-bold mb-2">
                      Graph Coming Soon!
                    </h4>
                    <p className="text-gray-400">
                      Advanced analytics and insights will be available here.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <div className="text-gray-500 mb-4">
                      <Lock className="w-16 h-16 mx-auto" />
                    </div>
                    <h4 className="text-white text-xl font-bold mb-2">
                      Graph Locked
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Rate 10 movies (unweighted) to unlock advanced analytics
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (stats.unweightedRatings / 10) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      {stats.unweightedRatings} / 10 movies rated
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "rated" && (
            <motion.div
              key="rated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Your Rated Movies</h3>
                <p className="text-gray-400">{ratedMovies.length} movies</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ratedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "watchlists" && (
            <motion.div
              key="watchlists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {watchlists.map((watchlist) => (
                <div key={watchlist.id} className="card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{watchlist.name}</h3>
                    <p className="text-gray-400">
                      {watchlist.movies.length} movies
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {watchlist.movies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        showRating={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
