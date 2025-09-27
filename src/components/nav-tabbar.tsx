"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, User, Wallet, Car, Bed } from "lucide-react"
import { cn } from "@/lib/utils"


const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rideshare", label: "RideShare", icon: Car },
  { href: "/couch", label: "Couch", icon: Bed },
  { href: "/history", label: "History", icon: History },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
]

export function NavTabbar() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed text-zinc-200 py-3 bottom-3 inset-x-3 z-50 rounded-2xl border bg-black/30 backdrop-blur-xl glass supports-[backdrop-filter]:bg-zinc-900 shadow-lg"
    >
      <ul className="flex items-center justify-between px-3 py-2 gap-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl py-2 text-xs",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", active && "text-zinc-900")} />
                <span className="sr-only sm:not-sr-only">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
