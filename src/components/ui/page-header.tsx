"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Marble } from "@worldcoin/mini-apps-ui-kit-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  statusText?: string;
  showAvatar?: boolean;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  statusText = "World ID Connected",
  showAvatar = true,
  children,
}: PageHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleAvatarClick = () => {
    router.push("/profile");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg shadow-amber-400/30 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="text-xl font-bold text-white">{title}</div>
              <div className="text-sm text-amber-200">{subtitle}</div>
            </div>
          </div>

          {showAvatar ? (
            <motion.div
              className="cursor-pointer"
              onClick={handleAvatarClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full flex items-center justify-center border-2 border-amber-300/50">
                  <Marble
                    src={session?.user?.profilePictureUrl}
                    className="w-10 h-10"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border border-white"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-sm font-medium text-amber-200">
                {statusText}
              </span>
            </motion.div>
          )}
        </div>

        {/* Page-specific content */}
        {children && <div className="space-y-4">{children}</div>}
      </div>
    </header>
  );
}
