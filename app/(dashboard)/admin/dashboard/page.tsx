"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShieldCheck, Users, FileText, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">
          Welcome, {user?.username?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor TomatoCare users, posts, and platform activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Platform Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Review activity and system health</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">User Management</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Track farmer and expert accounts</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Content Review</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Keep community posts useful and safe</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-xs text-muted-foreground">Experts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-card-foreground">Admin tools coming next</h2>
            <p className="text-sm text-muted-foreground mt-1">
              The layout is ready for user, post, and moderation management screens.
            </p>
          </div>
          <Button variant="outline">Review Roadmap</Button>
        </CardContent>
      </Card>
    </div>
  )
}
