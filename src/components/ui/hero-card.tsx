import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function HeroCard() {
    return (
        <Card className="border-none bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-md rounded-3xl overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-28 shrink-0 rounded-2xl overflow-hidden ring-1 ring-border">
                        <Image
                            src="/images/reference-ui.png"
                            alt="Journo vibe reference"
                            fill
                            sizes="(max-width: 768px) 180px, 200px"
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-pretty text-xl font-semibold">Journo</h1>
                        <p className="text-sm text-muted-foreground">
                            Community-powered travel. Share rides, stay with locals, and meet new friends.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
