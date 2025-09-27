import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  href?: string
  title: string
  description: string
  icon: React.ReactNode
  comingSoon?: boolean
  className?: string
}

export function FeatureCard({ href, title, description, icon, comingSoon, className }: Props) {
  const content = (
    <Card
      className={cn(
        "rounded-3xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm",
        className,
      )}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl grid place-items-center bg-primary/10 text-primary">{icon}</div>
        <div className="flex-1">
          <div className="text-base font-medium text-pretty">{title}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {href && !comingSoon ? (
          <Button size="sm" variant="default" className="rounded-full">
            Open
          </Button>
        ) : (
          <Button size="sm" variant="secondary" className="rounded-full" disabled aria-disabled>
            Soon
          </Button>
        )}
      </CardContent>
    </Card>
  )

  if (href && !comingSoon)
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  return content
}
