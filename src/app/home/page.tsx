import { Car, Bed, Sparkles, Shield, Users, Zap } from "lucide-react"
import { HeroCard } from "@/components/ui/hero-card"
import { FeatureCard } from "@/components/feature-card"
import { NavTabbar } from "@/components/nav-tabbar"
import { AuthButton } from "@/components/AuthButton"
import { useSession } from "next-auth/react"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

            <div className="relative mx-auto max-w-md px-4 pt-4 pb-28">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Journo</h1>
                        <p className="text-sm text-white/60">Travel with Verified Humans</p>
                    </div>
                    <AuthButton />
                </header>

                <div className="space-y-6">
                    <HeroCard />

                    <section aria-label="Core features" className="space-y-3">
                        <FeatureCard
                            href="/rideshare"
                            title="RideShare"
                            description="Find or offer a ride—simple, safe, and social."
                            icon={<Car className="h-5 w-5" />}
                        />
                        <FeatureCard
                            href="/couch"
                            title="Couch Surfing"
                            description="Free stays and local meetups with trusted hosts."
                            icon={<Bed className="h-5 w-5" />}
                        />
                    </section>

                    <section aria-label="Trust features" className="space-y-3">
                        <div className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Shield className="h-5 w-5 text-green-400" />
                                <h3 className="font-semibold text-white">World ID Verified</h3>
                            </div>
                            <p className="text-sm text-white/80">
                                Every user is cryptographically verified as a unique human through World ID.
                            </p>
                        </div>

                        <div className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Users className="h-5 w-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Trusted Community</h3>
                            </div>
                            <p className="text-sm text-white/80">
                                Connect with real people who share your passion for authentic travel experiences.
                            </p>
                        </div>

                        <div className="glass-surface glass-surface--fallback bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Zap className="h-5 w-5 text-yellow-400" />
                                <h3 className="font-semibold text-white">Smart Contracts</h3>
                            </div>
                            <p className="text-sm text-white/80">
                                Secure escrow system ensures safe transactions and dispute resolution.
                            </p>
                        </div>
                    </section>
                </div>

                <NavTabbar />
            </div>
        </main>
    )
}
