// tomato-classification-frontend/app/(dashboard)/farmer/dashboard/page.tsx
"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Lightbulb, ArrowRight, TrendingUp, FileText, MessageCircle } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { mockPosts, farmerTips } from "@/lib/mock-data"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Post } from "@/types/post"
import { fetchPosts } from "@/lib/api/post"

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { data } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  })

  const posts = data ?? []

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">
          Welcome back, {user?.username.split(" ")[0] || "Farmer"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your crops and connect with experts.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/farmer/disease-detection">
          <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Detect Disease
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a leaf image for instant analysis</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/farmer/community">
          <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Ask an Expert
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Get advice from agricultural experts</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/farmer/community">
          <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Community Feed
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Browse latest questions and solutions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">3</p>
              <p className="text-xs text-muted-foreground">Scans This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{12}</p>
              <p className="text-xs text-muted-foreground">My Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{34}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">2</p>
              <p className="text-xs text-muted-foreground">Diseases Found</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Community Posts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground font-heading">Recent Community Posts</h2>
            <Link href="/farmer/community">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} basePath="/farmer" />
            ))}
          </div>
        </div>

        {/* Farmer Tips */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground font-heading">Farming Tips</h2>
          <div className="flex flex-col gap-3">
            {farmerTips.map((tip, i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-4 flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0 mt-0.5 text-primary border-primary/30 bg-primary/5">
                    {i + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
