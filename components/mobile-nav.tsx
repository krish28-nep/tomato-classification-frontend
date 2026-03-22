"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, MessageSquare, User, Microscope } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const farmerItems = [
    { label: "Home", href: "/farmer/dashboard", icon: LayoutDashboard },
    { label: "Detect", href: "/farmer/disease-detection", icon: Search },
    { label: "Community", href: "/farmer/community", icon: MessageSquare },
    { label: "Profile", href: "/farmer/profile", icon: User },
  ]

  const expertItems = [
    { label: "Home", href: "/expert/dashboard", icon: LayoutDashboard },
    { label: "Analyze", href: "/expert/disease-analysis", icon: Microscope },
    { label: "Community", href: "/expert/community", icon: MessageSquare },
    { label: "Profile", href: "/expert/profile", icon: User },
  ]

  const items = user?.role === "user" ? farmerItems : expertItems

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
