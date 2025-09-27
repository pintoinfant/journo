"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    isComingSoon?: boolean;
    isActive?: boolean;
}

function FeatureCard({ title, description, imageSrc, imageAlt, isComingSoon = false, isActive = true }: FeatureCardProps) {
    return (
        <Card className={`relative overflow-hidden h-45 bg-green-600/20 border-none transition-all duration-300 hover:scale-105 ${isComingSoon || !isActive
            ? 'opacity-60 cursor-not-allowed'
            : ' border-green-500/50 hover:border-gren-400/70'
            }`}>
            {isComingSoon && (
                <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="bg-yellow-600/80 text-yellow-100 border-yellow-500">
                        Coming Soon
                    </Badge>
                </div>
            )}

            <CardHeader className="pb-4">
                <div className="flex gap-5 text-center flex-col justify-center items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-lime-400 to-green-500 p-1">
                        <div className="w-full h-full rounded-full bg-lime-400 flex items-center justify-center">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={48}
                                height={48}
                                className="rounded-full h-10 w-10"
                            />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-white text-md">{title}</CardTitle>
                        {/* <CardDescription className="text-gray-300">
                            {description}
                        </CardDescription> */}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {isComingSoon && (
                    <div className="text-center py-4">
                        Coming Soon
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function FeatureCards() {
    const features = [
        {
            title: 'Couch Surfing',
            description: 'Stay with locals for free',
            imageSrc: '/couchsurf.png',
            imageAlt: 'Couch surfing icon',
            isActive: true,
            isComingSoon: false
        },
        {
            title: 'Ride Sharing',
            description: 'Share rides and save money',
            imageSrc: '/rideshare.png',
            imageAlt: 'Ride sharing icon',
            isActive: true,
            isComingSoon: false
        },
        {
            title: 'Food Sharing',
            description: 'Share meals and recipes',
            imageSrc: '/food-share.png',
            imageAlt: 'Food sharing icon',
            isActive: false,
            isComingSoon: true
        },

        {
            title: 'Local Events',
            description: 'Discover local meetups',
            imageSrc: '/events.png',
            imageAlt: 'Events icon',
            isActive: false,
            isComingSoon: true
        },
        {
            title: 'Travel Planning',
            description: 'Plan trips together',
            imageSrc: '/travel-planning.png',
            imageAlt: 'Travel planning icon',
            isActive: false,
            isComingSoon: true
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <p className="text-gray-300 text-lg">Connecting nomads worldwide through shared experiences</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <FeatureCard
                    title={features[0].title}
                    description={features[0].description}
                    imageSrc={features[0].imageSrc}
                    imageAlt={features[0].imageAlt}
                    isActive={features[0].isActive}
                    isComingSoon={features[0].isComingSoon}
                />
                <FeatureCard
                    title={features[1].title}
                    description={features[1].description}
                    imageSrc={features[1].imageSrc}
                    imageAlt={features[1].imageAlt}
                    isActive={features[1].isActive}
                    isComingSoon={features[1].isComingSoon}
                />
            </div>

            <div className='grid grid-cols-3 gap-3'>
                <FeatureCard
                    title={features[2].title}
                    description={features[2].description}
                    imageSrc={features[2].imageSrc}
                    imageAlt={features[2].imageAlt}
                    isActive={features[2].isActive}
                    isComingSoon={features[2].isComingSoon}
                />
                <FeatureCard
                    title={features[3].title}
                    description={features[3].description}
                    imageSrc={features[3].imageSrc}
                    imageAlt={features[3].imageAlt}
                    isActive={features[3].isActive}
                    isComingSoon={features[3].isComingSoon}
                />
                <FeatureCard
                    title={features[4].title}
                    description={features[4].description}
                    imageSrc={features[4].imageSrc}
                    imageAlt={features[4].imageAlt}
                    isActive={features[4].isActive}
                    isComingSoon={features[4].isComingSoon}
                />
            </div>
        </div>
    );
}
