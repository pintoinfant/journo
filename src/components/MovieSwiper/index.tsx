"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Star, Heart, X, Plus, Play } from "lucide-react";
import { MovieService, Movie } from "@/lib/movies";

// Use centralized movie data
const SAMPLE_MOVIES: Movie[] = MovieService.getAllMovies();

interface MovieCardProps {
  movie: Movie;
  onSwipe: (direction: "left" | "right") => void;
  onRate: () => void;
  isTop: boolean;
}

function MovieCard({ movie, onSwipe, onRate, isTop }: MovieCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className={`absolute w-80 h-[500px] bg-gray-900 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing ${
        isTop ? "z-10" : "z-0"
      }`}
      style={{
        x,
        rotate,
        opacity: isTop ? opacity : 1,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: isTop ? 1.02 : 1 }}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
    >
      {/* Movie Poster */}
      <div className="relative w-full h-2/3 overflow-hidden rounded-t-2xl">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-80 rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-bold">{movie.rating}</span>
        </div>

        {/* ENS Subname */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full px-3 py-1">
          <span className="text-white text-xs font-semibold">
            {movie.ensSubname}
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-6 space-y-3">
        <div>
          <h3 className="text-white text-xl font-bold">{movie.title}</h3>
          <p className="text-gray-400 text-sm">
            {movie.year} • {movie.director} • {movie.runtime}min
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g) => (
            <span
              key={g}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
            >
              {g}
            </span>
          ))}
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">
          {movie.description}
        </p>
      </div>

      {/* Action Buttons for Top Card */}
      {isTop && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe("left")}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRate}
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe("right")}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function MovieSwiper() {
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [showRatingFlow, setShowRatingFlow] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);

    // Show feedback animation
    setTimeout(() => {
      if (currentIndex < movies.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Load more movies or show completion
        setCurrentIndex(0);
        setMovies([...movies, ...SAMPLE_MOVIES]);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleRate = () => {
    setSelectedMovie(movies[currentIndex]);
    setShowRatingFlow(true);
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Discover Movies</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm">Movies Discovered</p>
              <p className="text-yellow-400 text-lg font-bold">
                {currentIndex}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Cards */}
      <div className="flex items-center justify-center h-full pt-20">
        <div className="relative">
          {visibleMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSwipe={handleSwipe}
              onRate={handleRate}
              isTop={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Swipe Feedback */}
      {swipeDirection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              swipeDirection === "right" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {swipeDirection === "right" ? (
              <Plus className="w-12 h-12 text-white" />
            ) : (
              <X className="w-12 h-12 text-white" />
            )}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="glass rounded-2xl p-4">
          <div className="flex justify-center items-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </div>
              <span className="text-sm">Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <span className="text-sm">Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm">Watchlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Flow Modal */}
      {showRatingFlow && selectedMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-white text-2xl font-bold mb-4">
              Rate "{selectedMovie.title}"
            </h3>
            <p className="text-gray-300 mb-6">
              To rate this movie, you'll need to:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">1</span>
                </div>
                <span className="text-gray-300">Verify with World ID</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">2</span>
                </div>
                <span className="text-gray-300">
                  Prove you watched it with vLayer
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
                <span className="text-gray-300">Submit your rating</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingFlow(false)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRatingFlow(false);
                  // Navigate to rating flow
                }}
                className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-semibold"
              >
                Start Rating
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
