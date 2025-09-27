"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { List, Star, ChevronUp } from "lucide-react";

interface SwipeGuideProps {
  show: boolean;
  onClose: () => void;
}

export default function SwipeGuide({ show, onClose }: SwipeGuideProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gradient-to-br from-amber-900/95 to-orange-900/95 border-2 border-amber-400/30 max-w-sm backdrop-blur-sm rounded-3xl shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400/30 to-amber-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-400/40">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Discover Movies
                  </h2>
                  <p className="text-amber-200">Swipe to interact with films</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30">
                      <List className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Swipe Left</div>
                      <div className="text-amber-200 text-sm">Add to List</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-400/30">
                      <Star className="w-6 h-6 text-orange-300" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        Swipe Right
                      </div>
                      <div className="text-amber-200 text-sm">Rate Movie</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <ChevronUp className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Swipe Up</div>
                      <div className="text-amber-200 text-sm">Next Movie</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-amber-300/80">
                  Tap anywhere to start discovering
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
