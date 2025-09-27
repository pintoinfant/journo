import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Ride = {
  id: string
  driver: string
  time: string
  price: string
  seats: number
  from?: string
  to?: string
  description?: string
}

export function RideCard({ ride }: { ride: Ride }) {
  return (
    <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-medium text-white">{ride.driver}</div>
            <div className="text-xs text-white/60">
              {ride.time} • {ride.seats} seats available
            </div>
            {ride.from && ride.to && (
              <div className="text-xs text-white/80 mt-1">
                {ride.from} → {ride.to}
              </div>
            )}
            {ride.description && (
              <div className="text-xs text-white/70 mt-1">
                {ride.description}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{ride.price}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {ride.seats} seats
            </Badge>
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="w-full rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md"
        >
          Request Ride
        </Button>
      </CardContent>
    </Card>
  )
}
