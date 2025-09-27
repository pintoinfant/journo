"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll use a mock sign-in
      // In production, this would integrate with World ID
      await signIn("credentials", {
        nonce: "demo_nonce",
        signedNonce: "demo_signed_nonce",
        finalPayloadJson: JSON.stringify({
          address: "0x1234567890123456789012345678901234567890",
          username: "Demo User",
          profilePictureUrl: "/api/placeholder/100/100"
        }),
        redirect: false
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Button disabled className="rounded-xl bg-white/20 text-white border border-white/30">
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-white">
          Welcome, {session.user?.username || "User"}
        </div>
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          className="rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30"
    >
      {isLoading ? "Signing in..." : "Sign In with World ID"}
    </Button>
  );
}