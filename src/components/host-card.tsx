import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Host = {
  id: string
  name: string
  city: string
  spots: number
  price?: number
  type?: 'couch' | 'private_room' | 'entire_place'
  description?: string
  amenities?: string[]
}

export function HostCard({ host }: { host: Host }) {
  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'couch': return 'Couch'
      case 'private_room': return 'Private Room'
      case 'entire_place': return 'Entire Place'
      default: return 'Accommodation'
    }
  }

  const getPriceDisplay = (price?: number) => {
    if (price === 0) return 'Free'
    return `$${price}/night`
  }

  return (
    <Card className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-medium text-white">{host.name}</div>
            <div className="text-xs text-white/60">
              {host.city} • {host.spots} spots
            </div>
            <div className="text-xs text-white/80 mt-1">
              {host.description}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              {getPriceDisplay(host.price)}
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              {getTypeLabel(host.type)}
            </Badge>
          </div>
        </div>
        
        {host.amenities && host.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {host.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {host.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{host.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          size="sm" 
          className="w-full rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-md"
        >
          Request Stay
        </Button>
      </CardContent>
    </Card>
  )
}
