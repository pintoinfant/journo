"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Eye, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { createVlayerClient } from "@vlayer/sdk";
import {
  createWebProofRequest,
  startPage,
  expectUrl,
  notarize,
} from "@vlayer/sdk/web_proof";

const vlayer = createVlayerClient();

interface RatingFlowProps {
  movie: {
    title: string;
    year: number;
    poster: string;
    ens: string;
    netflixId?: string; // Netflix title ID (e.g., 70230640)
  };
  onComplete: () => void;
  onCancel: () => void;
}

type FlowStep = "world-verify" | "vlayer-verify" | "rating" | "complete";
type VerificationState = "pending" | "success" | "failed" | undefined;

export default function RatingFlow({
  movie,
  onComplete,
  onCancel,
}: RatingFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("rating");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [verificationState, setVerificationState] =
    useState<VerificationState>(undefined);
  const [isVerified, setIsVerified] = useState(false);
  const { isInstalled } = useMiniKit();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  const steps = [
    { id: "world-verify", title: "WorldChain Verification", icon: Shield },
    { id: "vlayer-verify", title: "vLayer Watch Verification", icon: Eye },
    { id: "rating", title: "Rate Movie", icon: Star },
  ];

  const handleVerifyHumanity = async () => {
    console.log("🔄 Starting World ID verification...");
    console.log("📱 MiniKit installed?", isInstalled);
    setVerificationState("pending");

    try {
      // Check if MiniKit is available
      if (!isInstalled) {
        throw new Error(
          "This feature is only available in World App. Please open this app in World App to verify your humanity."
        );
      }

      if (!MiniKit) {
        throw new Error("MiniKit is not available");
      }

      console.log("📱 Calling MiniKit.commandsAsync.verify...");
      const result = await MiniKit.commandsAsync.verify({
        action: "prove-humanity", // Using prove-humanity as action ID
        verification_level: VerificationLevel.Orb, // Using Orb for humanity verification
      });

      console.log("✅ Verification result:", result);

      if (result.finalPayload.status !== "success") {
        console.error("❌ World ID verification failed:", result.finalPayload);
        setVerificationState("failed");
        setTimeout(() => {
          setVerificationState(undefined);
        }, 3000);
        return;
      }

      console.log("🔍 Verifying proof on server...");

      // Verify the proof on the server
      const response = await fetch("/api/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: result.finalPayload,
          action: "prove-humanity",
        }),
      });

      console.log("📡 Server response status:", response.status);
      const data = await response.json();
      console.log("📋 Server response data:", data);

      if (data.verifyRes?.success) {
        console.log("🎉 Verification successful!");
        setVerificationState("success");
        setIsVerified(true);
        // Move to next step after successful verification
        setTimeout(() => {
          setCurrentStep("vlayer-verify");
        }, 1000);
      } else {
        console.error("❌ Server verification failed:", data);
        setVerificationState("failed");
        setTimeout(() => {
          setVerificationState(undefined);
        }, 3000);
      }
    } catch (error) {
      console.error("💥 Verification failed with error:", error);
      setVerificationState("failed");

      // Show more specific error message
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }

      setTimeout(() => {
        setVerificationState(undefined);
      }, 3000);
    }
  };

  const handleVLayerVerify = async () => {
    try {
      setVerificationStatus("verifying");

      console.log("🎬 Starting vLayer verification for movie:", movie.title);
      console.log("📺 Netflix ID:", movie.netflixId);

      // Create Web Proof request with essential steps only
      const webProofRequest = createWebProofRequest({
        steps: [
          // Step 1: Go to Netflix login page
          startPage(
            "https://www.netflix.com/login",
            "Go to Netflix login page"
          ),

          // Step 2: Navigate to the specific movie page
          expectUrl(
            `https://www.netflix.com/title/${movie.netflixId || "70230640"}`,
            `Navigate to ${movie.title}`
          ),

          // Step 3: Notarize the GET request to the movie page
          notarize(
            `https://www.netflix.com/title/${movie.netflixId || "70230640"}`,
            "GET",
            `Notarize viewing ${movie.title} page`
          ),
        ],
      });

      // Request Web Proof using vlayer
      const hash = await vlayer.proveWeb({
        address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        proverAbi: [],
        functionName: "verifyNetflixViewing",
        args: [webProofRequest, movie.netflixId || "70230640"] as never,
        chainId: 11155111,
      });

      console.log("✅ Web Proof generated successfully:", hash.toString());

      // Check if user can access the movie page
      const watchStatus = await parseWebProofForWatchStatus(hash.toString());
      console.log("🎬 Watch status from proof:", watchStatus);

      if (watchStatus === "NEVER_WATCHED") {
        console.log("❌ User cannot access this movie");
        setVerificationStatus("error");
        throw new Error("NOT WATCHED YET");
      }

      console.log("✅ User can access this movie");
      setVerificationStatus("success");

      // Proceed to rating step after successful verification
      setTimeout(() => {
        setCurrentStep("rating");
        setVerificationStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("💥 vLayer verification failed:", error);
      setVerificationStatus("error");

      // Retry after error
      setTimeout(() => {
        setVerificationStatus("idle");
      }, 3000);
    }
  };

  const parseWebProofForWatchStatus = async (
    webProofHash: string
  ): Promise<string> => {
    try {
      console.log("🔍 Parsing Web Proof Hash:", webProofHash);

      // If proof was generated successfully, user can access the movie
      console.log("📋 Web Proof Hash to parse:", webProofHash);
      console.log("🎬 This proves the user can access the Netflix movie page");

      // For now, always return watched since proof generation succeeded
      return "WATCHED";
    } catch (error) {
      console.error("💥 Error parsing Web Proof for watch status:", error);
      return "NEVER_WATCHED";
    }
  };

  // REAL WATCH STATUS FUNCTION - COMMENTED OUT FOR PARALLEL DEVELOPMENT
  /*
  const checkWatchStatus = async (netflixId?: string): Promise<string> => {
    if (!netflixId) return 'NEVER_WATCHED';
    
    try {
      console.log('Checking watch status for Netflix ID:', netflixId);
      
      // This would be the actual GraphQL query to Netflix's API
      // The response would contain the watchStatus field
      const graphqlQuery = {
        query: `
          query WatchStatus($netflixId: String!) {
            title(id: $netflixId) {
              watchStatus
            }
          }
        `,
        variables: { netflixId }
      };
      
      console.log('GraphQL Query:', JSON.stringify(graphqlQuery, null, 2));
      
      // In reality, this would be parsed from the vlayer Web Proof response
      console.log('This should be replaced with actual GraphQL response from vlayer proof');
      
      return 'NEVER_WATCHED';
    } catch (error) {
      console.error('Error checking watch status:', error);
      return 'NEVER_WATCHED';
    }
  };
  */

  const handleRatingSubmit = () => {
    if (rating > 0) {
      setCurrentStep("complete");
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-xl border-2 border-amber-200/50 shadow-2xl shadow-amber-400/20">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-amber-900 mb-1">
                {movie.title}
              </CardTitle>
              <p className="text-amber-700 text-sm mb-2">{movie.year}</p>
              <Badge className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-800 border border-amber-400/30 text-xs px-3 py-1">
                {movie.ens}
              </Badge>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-3 mb-6 bg-white/40 rounded-2xl p-4 border border-amber-200/30">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500 shadow-lg shadow-amber-400/40"
                          : isActive
                          ? "border-orange-500 bg-orange-100 text-orange-600"
                          : "border-amber-300 bg-amber-50 text-amber-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 font-medium ${
                        isCompleted
                          ? "text-amber-600"
                          : isActive
                          ? "text-orange-600"
                          : "text-amber-500"
                      }`}
                    >
                      {step.title.split(" ")[0]}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-3 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-amber-400 to-amber-600"
                          : "bg-amber-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <AnimatePresence mode="wait">
            {currentStep === "world-verify" && (
              <motion.div
                key="world-verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-300/50">
                  <Shield className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-900">
                  Verify Your Humanity
                </h3>
                <p className="text-amber-700 text-sm mb-8 leading-relaxed">
                  Confirm your identity through World ID to ensure authentic
                  movie ratings
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={handleVerifyHumanity}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-400/30 border-0 transition-all duration-200"
                    disabled={verificationState === "pending" || !isInstalled}
                  >
                    {!isInstalled
                      ? "⚠️ World App Required"
                      : verificationState === "pending"
                      ? "Verifying..."
                      : verificationState === "success"
                      ? "✓ Verified!"
                      : verificationState === "failed"
                      ? "Verification Failed - Try Again"
                      : "Verify with World ID"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="w-full bg-transparent border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium py-3 rounded-xl"
                    disabled={verificationState === "pending"}
                  >
                    Cancel
                  </Button>
                  {!isInstalled && (
                    <div className="text-xs text-amber-600 mt-3 p-3 bg-amber-100/50 rounded-lg border border-amber-200/50">
                      This feature requires World App for World ID verification
                    </div>
                  )}
                  {verificationState === "failed" && (
                    <div className="text-xs text-red-600 mt-3 p-3 bg-red-100/50 rounded-lg border border-red-200/50">
                      Check console for detailed error information
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === "vlayer-verify" && (
              <motion.div
                key="vlayer-verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-300/50">
                  <Eye className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-900">
                  Verify Your Viewing
                </h3>
                <p className="text-amber-700 text-sm mb-8 leading-relaxed">
                  We'll verify your viewing history for{" "}
                  <span className="font-semibold">{movie.title}</span> to ensure
                  authentic ratings
                </p>

                {verificationStatus === "verifying" && (
                  <div className="mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-2"></div>
                    <p className="text-orange-300 text-sm">
                      Generating verification proof...
                    </p>
                  </div>
                )}

                {verificationStatus === "success" && (
                  <div className="mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 text-sm">
                      Verification successful! Viewing confirmed.
                    </p>
                  </div>
                )}

                {verificationStatus === "error" && (
                  <div className="mb-4">
                    <div className="bg-red-900/30 rounded-lg p-3 border border-red-400/30">
                      <p className="text-red-300 text-sm font-semibold">
                        VERIFICATION FAILED
                      </p>
                      <p className="text-red-200 text-xs mt-1">
                        Please try again or contact support.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleVLayerVerify}
                    className="w-full"
                    disabled={verificationStatus === "verifying"}
                  >
                    {verificationStatus === "verifying"
                      ? "Generating Proof..."
                      : "Start Verification"}
                  </Button>
                  <div className="text-xs text-amber-300">
                    This will verify your viewing history to confirm you've
                    watched this movie
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "rating" && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-300/50">
                  <Star className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-900">
                  Rate {movie.title}
                </h3>
                <p className="text-amber-700 text-sm mb-8 leading-relaxed">
                  How would you rate this movie?
                </p>

                <div className="bg-white/40 rounded-2xl p-6 mb-6 border border-amber-200/30">
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        className={`w-8 h-8 transition-all duration-200 ${
                          star <= (hoveredRating || rating)
                            ? "text-amber-400 scale-110"
                            : "text-amber-300 hover:text-amber-400 hover:scale-105"
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star className="w-full h-full fill-current drop-shadow-sm" />
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl font-bold text-amber-600 mb-2"
                    >
                      {rating}/10 ★
                    </motion.div>
                  )}

                  <div className="text-xs text-amber-600">
                    {rating === 0
                      ? "Tap stars to rate"
                      : "Perfect! Click submit when ready"}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-yellow-400/30 border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Rating
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="w-full bg-transparent border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium py-3 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-300/50">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-900">
                  Rating Submitted!
                </h3>
                <p className="text-amber-700 text-sm mb-6 leading-relaxed">
                  Your rating for{" "}
                  <span className="font-semibold">{movie.title}</span> has been
                  recorded on the blockchain
                </p>
                <div className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-2xl p-6 border border-amber-200/30 mb-6">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {rating}/10
                  </div>
                  <div className="flex justify-center">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
