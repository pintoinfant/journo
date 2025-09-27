"use client";

import { AuthButton } from "@/components/AuthButton";
import { useRouter } from "next/navigation";
import LaserFlow from '@/components/LazerFlow';
import Image from 'next/image';
import { useRef } from 'react';
import CircularGallery from '@/components/CircularGallery'

export default function LandingPage() {
  const router = useRouter();
  const revealImgRef = useRef(null);
  return (
    <div
      className="min-h-screen pt-0 overflow-hidden relative"

    >
      <div
        style={{
          height: '600px',
          position: 'relative',
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty('--mx', '-9999px');
            el.style.setProperty('--my', '-9999px');
          }
        }}
      >
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#11ff11"
        />

        <div className="border border-zinc-200 rounded-xl" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '86%',
          height: '60%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          zIndex: 6
        }}>
          {/* Your content here */}
          <div className="text-center space-y-8 mt-6 p-15 rounded-2xl">
            <div className="flex justify-center -mb-3">
              <Image
                src="/Journo.png"
                alt="Journo Logo"
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
            <p className="text-white !text-lg mb-10 w-full">
              The Nomad's Network
            </p>
            <div className="flex justify-center mt-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-24">
        {/* <FeatureCards /> */}
        <CircularGallery bend={4} />
      </div>

    </div>
  );
}
