"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Microscope,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { PostCard } from "@/components/post-card"
import { mockPosts } from "@/lib/mock-data"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Post } from "@/types/post"
import { fetchPosts } from "@/lib/api/post"

export default function ExpertDashboard() {
  const { user } = useAuth()
  const unansweredPosts = mockPosts.filter((p) => p.comments.length === 0).slice(0, 2)
  const recentPosts = mockPosts.slice(0, 2)

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  })

  const data = {
    postCount: "12",
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">
          Welcome, {user?.username?.split(" ")[0] || "Expert"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Help farmers by analyzing diseases and sharing your expertise.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/expert/disease-analysis">
          <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Microscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Analyze Disease
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upload and verify disease images</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/expert/community">
          <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Answer Questions
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Help farmers with their problems</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/expert/knowledge-posts">
          <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group h-full">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Publish Knowledge
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Share guides and solutions</p>
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
              <p className="text-2xl font-bold text-card-foreground">156</p>
              <p className="text-xs text-muted-foreground">Cases Analyzed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">89</p>
              <p className="text-xs text-muted-foreground">Farmers Helped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{data?.postCount || 28}</p>
              <p className="text-xs text-muted-foreground">Knowledge Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{89}</p>
              <p className="text-xs text-muted-foreground">Answers Given</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        {unansweredPosts.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground font-heading flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-accent" />
                Needs Your Expertise
              </h2>
            </div>
            {posts && posts.map((post) => (
              <PostCard key={post.id} post={post} basePath="/expert" />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground font-heading">Recent Discussions</h2>
            <Link href="/expert/community">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          {posts && posts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/expert" />
          ))}
        </div>
      </div>
    </div>
  )
}
