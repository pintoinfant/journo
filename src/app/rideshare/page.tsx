"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RideCard } from "@/components/ride-card"
import { NavTabbar } from "@/components/nav-tabbar"

interface Ride {
  _id: string;
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

export default function RideSharePage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRides = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      
      const response = await fetch(`/api/rides?${params.toString()}`)
      const data = await response.json()
      setRides(data.rides || [])
    } catch (error) {
      console.error('Error fetching rides:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRides()
  }, [])

  const handleSearch = () => {
    fetchRides()
  }

  const formatRideForCard = (ride: Ride) => ({
    id: ride._id,
    driver: `Driver ${ride.driverId.slice(-4)}`,
    time: `${new Date(ride.date).toLocaleDateString()} • ${ride.time}`,
    price: `$${ride.price}`,
    seats: ride.seats,
    from: ride.from.address,
    to: ride.to.address,
    description: ride.description
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

      <div className="relative mx-auto max-w-md px-4 pt-4 pb-28 space-y-4">
        <h1 className="text-lg font-semibold text-white">RideShare</h1>

        <section aria-label="Search" className="grid grid-cols-1 gap-3">
          <div className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
            <label className="text-xs text-white/80 font-medium">Pickup</label>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Where from?"
              className="mt-1 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            />
          </div>
          <div className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
            <label className="text-xs text-white/80 font-medium">Destination</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Where to?"
              className="mt-1 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="rounded-full bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md"
          >
            Find Rides
          </Button>
        </section>

        <section aria-label="Available rides" className="space-y-3">
          {loading ? (
            <div className="text-white/60 text-center py-8">Loading rides...</div>
          ) : rides.length === 0 ? (
            <div className="text-white/60 text-center py-8">No rides found. Try a different search.</div>
          ) : (
            rides.map((ride) => (
              <RideCard key={ride._id} ride={formatRideForCard(ride)} />
            ))
          )}
        </section>

        <NavTabbar />
      </div>
    </main>
  )
}
