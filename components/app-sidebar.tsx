"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  FileText,
  User,
  Leaf,
  Microscope,
  BookOpen,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const farmerNav: NavItem[] = [
    { label: "Dashboard", href: "/farmer/dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { label: "Disease Detection", href: "/farmer/disease-detection", icon: <Search className="h-4.5 w-4.5" /> },
    { label: "Community", href: "/farmer/community", icon: <MessageSquare className="h-4.5 w-4.5" /> },
    { label: "My Posts", href: "/farmer/my-posts", icon: <FileText className="h-4.5 w-4.5" /> },
    { label: "Notifications", href: "/farmer/notifications", icon: <Bell className="h-4.5 w-4.5" /> },
    { label: "Profile", href: "/farmer/profile", icon: <User className="h-4.5 w-4.5" /> },
  ]

  const expertNav: NavItem[] = [
    { label: "Dashboard", href: "/expert/dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { label: "Disease Analysis", href: "/expert/disease-analysis", icon: <Microscope className="h-4.5 w-4.5" /> },
    { label: "Community", href: "/expert/community", icon: <MessageSquare className="h-4.5 w-4.5" /> },
    { label: "Knowledge Posts", href: "/expert/knowledge-posts", icon: <BookOpen className="h-4.5 w-4.5" /> },
    { label: "Notifications", href: "/expert/notifications", icon: <Bell className="h-4.5 w-4.5" /> },
    { label: "Profile", href: "/expert/profile", icon: <User className="h-4.5 w-4.5" /> },
  ]

  const navItems = user?.role === "user" ? farmerNav : expertNav

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Leaf className="h-4.5 w-4.5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold text-base text-sidebar-foreground font-heading">TomatoCare</span>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
            {user?.role === "user"
              ? "Tip: Upload a leaf image for instant disease detection."
              : "Help farmers by answering questions in the community."}
          </p>
        </div>
      </div>
    </aside>
  )
}
