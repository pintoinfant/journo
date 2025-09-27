"use client"

import { useState } from "react"
import { NavTabbar } from "@/components/nav-tabbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  const [connected, setConnected] = useState(false)

  return (
    <main className="mx-auto max-w-md px-4 pt-4 pb-28 space-y-4">
      <h1 className="text-lg font-semibold">Wallet</h1>

      <Card className="glass-surface">
        <CardContent className="p-4">
          <div className="text-sm">Connection Status</div>
          <div className="text-xs text-muted-foreground mb-3">{connected ? "Connected" : "Disconnected"}</div>
          <Button className="rounded-full" onClick={() => setConnected((v) => !v)}>
            {connected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>

      <NavTabbar />
    </main>
  )
}
