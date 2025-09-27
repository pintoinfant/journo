"use client"

import { useSession } from "next-auth/react"
import { NavTabbar } from "@/components/nav-tabbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, MapPin, Globe, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

      <div className="relative mx-auto max-w-md px-4 pt-4 pb-28 space-y-4">
        <h1 className="text-lg font-semibold text-white">Profile</h1>

        {session ? (
          <div className="space-y-4">
            <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {session.user?.username?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{session.user?.username}</div>
                    <div className="text-sm text-white/60">
                      {session.user?.walletAddress?.slice(0, 6)}...{session.user?.walletAddress?.slice(-4)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    World ID Verified
                  </Badge>
                  <Badge variant="outline" className="text-white/80 border-white/30">
                    Orb+ Level
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-white">Travel Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-white/60">Rides Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">8</div>
                    <div className="text-xs text-white/60">Hosted Guests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-white">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>Based in Amsterdam, Netherlands</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Globe className="h-4 w-4" />
                    <span>Languages: English, Dutch</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>Member since January 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button className="w-full rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full rounded-xl text-white border-white/30 hover:bg-white/10">
                View My Listings
              </Button>
            </div>
          </div>
        ) : (
          <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/80 mb-4">Please sign in to view your profile.</p>
              <Button className="rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md">
                Sign In with World ID
              </Button>
            </CardContent>
          </Card>
        )}

        <NavTabbar />
      </div>
    </main>
  )
}
