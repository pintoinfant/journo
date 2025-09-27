"use client";

import { motion } from "framer-motion";

type PageType = "landing" | "discover" | "profile" | "movies";

interface AppNavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onShowLanding: () => void;
}

export default function AppNavigation({
  currentPage,
  onPageChange,
  onShowLanding,
}: AppNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-t border-gray-800">
      <div className="flex justify-around items-center py-4 px-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange("discover")}
          className={`flex flex-col items-center gap-1 ${
            currentPage === "discover" ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          <div className="w-6 h-6 bg-current rounded-full"></div>
          <span className="text-xs">Discover</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange("movies")}
          className={`flex flex-col items-center gap-1 ${
            currentPage === "movies" ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          <div className="w-6 h-6 bg-current rounded-full"></div>
          <span className="text-xs">Movies</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange("profile")}
          className={`flex flex-col items-center gap-1 ${
            currentPage === "profile" ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          <div className="w-6 h-6 bg-current rounded-full"></div>
          <span className="text-xs">Profile</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onShowLanding}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <div className="w-6 h-6 bg-current rounded-full"></div>
          <span className="text-xs">Home</span>
        </motion.button>
      </div>
    </div>
  );
}
