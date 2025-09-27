"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, Star, TrendingUp, BookOpen, Search } from "lucide-react";
import BottomNav from "@/components/ui/bottom-nav";
import PageHeader from "@/components/ui/page-header";
import { MovieService } from "@/lib/movies";

// Use centralized movie data and add user-specific fields
const allMovies = MovieService.getAllMovies();

const watchlist = allMovies.slice(0, 2).map((movie) => ({
  ...movie,
  genre: movie.genres, // For backward compatibility
}));

const favorites = allMovies.slice(1, 3).map((movie, index) => ({
  ...movie,
  genre: movie.genres, // For backward compatibility
  yourRating: index === 0 ? 9 : 10, // Mock user ratings
}));

const recentlyRated = allMovies.slice(2, 4).map((movie, index) => ({
  ...movie,
  genre: movie.genres, // For backward compatibility
  yourRating: index === 0 ? 8 : 9, // Mock user ratings
}));

export default function ListsPage() {
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <PageHeader
          title="Your Lists"
          subtitle="Track your cinema journey"
          icon={BookOpen}
          statusText="WorldID Connected"
        >
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-amber-700" />
            </div>
            <input
              type="text"
              placeholder="           Search your movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!w-full pl-10 pr-4 py-3 bg-white/90 border-2 border-amber-200 rounded-lg h-10 text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 shadow-lg"
            />
          </div>

          {/* Tabs */}
          <TabsList className="grid w-full grid-cols-3 bg-white/90 border-2 border-amber-200 rounded-xl p-1 shadow-lg h-fit">
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-700 font-medium rounded-lg transition-all duration-200 px-3 py-2"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="watchlist"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-700 font-medium rounded-lg transition-all duration-200 px-3 py-2"
            >
              <Clock className="w-4 h-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-700 font-medium rounded-lg transition-all duration-200 px-3 py-2"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>
        </PageHeader>

        {/* Main Content */}
        <main className="flex-1 pt-64 pb-28 px-6">
          <AnimatePresence mode="wait">
            {/* Recent Tab */}
            <TabsContent value="recent" className="mt-0 h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 h-full overflow-y-auto pb-4"
              >
                {recentlyRated
                  .filter(
                    (movie) =>
                      movie.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.director
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.ens
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-lg shadow-amber-400/10 hover:shadow-xl hover:shadow-amber-400/20 transition-all duration-300"
                    >
                      <div className="flex">
                        <div className="relative w-24 h-36 flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-bold">
                              {movie.rating}
                            </span>
                          </div>
                          {/* Your Rating */}
                          <div className="absolute bottom-2 left-2 bg-amber-500 rounded-full px-2 py-1 flex items-center gap-1">
                            <span className="text-white text-xs font-bold">
                              {movie.yourRating}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="text-lg font-bold text-amber-900 mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-amber-700 text-sm mb-2">
                            {movie.year} • {movie.director}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genre.slice(0, 2).map((g) => (
                              <Badge
                                key={g}
                                className="bg-amber-100 text-amber-800 text-xs px-2 py-1"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-amber-300 text-amber-700 text-xs"
                          >
                            {movie.ens}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>

            {/* Watchlist Tab */}
            <TabsContent value="watchlist" className="mt-0 h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 h-full overflow-y-auto pb-4"
              >
                {watchlist
                  .filter(
                    (movie) =>
                      movie.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.director
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.ens
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-lg shadow-amber-400/10 hover:shadow-xl hover:shadow-amber-400/20 transition-all duration-300"
                    >
                      <div className="flex">
                        <div className="relative w-24 h-36 flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-bold">
                              {movie.rating}
                            </span>
                          </div>
                          {/* Watchlist Icon */}
                          <div className="absolute bottom-2 left-2 bg-blue-500 rounded-full px-2 py-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="text-lg font-bold text-amber-900 mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-amber-700 text-sm mb-2">
                            {movie.year} • {movie.director}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genre.slice(0, 2).map((g) => (
                              <Badge
                                key={g}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-amber-300 text-amber-700 text-xs"
                          >
                            {movie.ens}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-0 h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 h-full overflow-y-auto pb-4"
              >
                {favorites
                  .filter(
                    (movie) =>
                      movie.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.director
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      movie.ens
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-lg shadow-amber-400/10 hover:shadow-xl hover:shadow-amber-400/20 transition-all duration-300"
                    >
                      <div className="flex">
                        <div className="relative w-24 h-36 flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-bold">
                              {movie.rating}
                            </span>
                          </div>
                          {/* Your Rating */}
                          <div className="absolute bottom-2 left-2 bg-red-500 rounded-full px-2 py-1 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-white fill-current" />
                            <span className="text-white text-xs font-bold">
                              {movie.yourRating}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="text-lg font-bold text-amber-900 mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-amber-700 text-sm mb-2">
                            {movie.year} • {movie.director}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genre.slice(0, 2).map((g) => (
                              <Badge
                                key={g}
                                className="bg-red-100 text-red-800 text-xs px-2 py-1"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-amber-300 text-amber-700 text-xs"
                          >
                            {movie.ens}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </main>
      </Tabs>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
