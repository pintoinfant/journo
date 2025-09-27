"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { HostCard } from "@/components/host-card"
import { NavTabbar } from "@/components/nav-tabbar"
import { Button } from "@/components/ui/button"

interface Listing {
  _id: string;
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

export default function CouchPage() {
  const [q, setQ] = useState("")
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/listings?q=${encodeURIComponent(q)}`)
      const data = await response.json()
      setListings(data.listings || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [q])

  const handleSearch = () => {
    fetchListings()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

      <div className="relative mx-auto max-w-md px-4 pt-4 pb-28 space-y-4">
        <h1 className="text-lg font-semibold text-white">Couch Surfing</h1>

        <section
          aria-label="Search hosts"
          className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3"
        >
          <label className="text-xs text-white/80 font-medium">Search city or host</label>
          <div className="flex gap-2 mt-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try Oslo, Berlin..."
              className="flex-1 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            />
            <Button 
              onClick={handleSearch}
              className="rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md"
            >
              Search
            </Button>
          </div>
        </section>

        <section aria-label="Hosts" className="space-y-3">
          {loading ? (
            <div className="text-white/60 text-center py-8">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-white/60 text-center py-8">No listings found. Try a different search.</div>
          ) : (
            listings.map((listing) => (
              <HostCard 
                key={listing._id} 
                host={{
                  id: listing._id,
                  name: listing.title,
                  city: listing.location.address,
                  spots: 1,
                  price: listing.price,
                  type: listing.type,
                  description: listing.description,
                  amenities: listing.amenities
                }} 
              />
            ))
          )}
        </section>

        <NavTabbar />
      </div>
    </main>
  )
}
