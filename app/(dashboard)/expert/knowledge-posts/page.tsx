"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Eye, MessageCircle, ThumbsUp, Clock } from "lucide-react"
import { CreatePostModal } from "@/components/create-post-modal"

const knowledgePosts = [
  {
    id: "kp1",
    title: "Complete Guide to Managing Early Blight in Tomatoes",
    excerpt: "Early Blight is one of the most common fungal diseases affecting tomato crops worldwide. This comprehensive guide covers identification, prevention, and treatment strategies...",
    views: 1240,
    likes: 89,
    comments: 23,
    publishedAt: "2026-02-20",
    tags: ["early-blight", "fungal", "guide"],
    status: "published" as const,
  },
  {
    id: "kp2",
    title: "Organic Pest Management for Tomato Whiteflies",
    excerpt: "Whiteflies are a major vector for Tomato Yellow Leaf Curl Virus. Learn about effective organic methods to control whitefly populations without harming beneficial insects...",
    views: 856,
    likes: 67,
    comments: 15,
    publishedAt: "2026-02-15",
    tags: ["organic", "whitefly", "pest-management"],
    status: "published" as const,
  },
  {
    id: "kp3",
    title: "Soil Solarization Techniques for Disease Prevention",
    excerpt: "Soil solarization is an effective non-chemical method for controlling soil-borne pathogens. This article explains the process step by step for smallholder farmers...",
    views: 623,
    likes: 45,
    comments: 8,
    publishedAt: "2026-02-10",
    tags: ["soil", "prevention", "technique"],
    status: "published" as const,
  },
  {
    id: "kp4",
    title: "Understanding Fusarium Wilt Resistance in Tomato Varieties",
    excerpt: "Choosing resistant tomato varieties is the most effective strategy against Fusarium Wilt. This article reviews the latest resistant cultivars available for tropical regions...",
    views: 412,
    likes: 34,
    comments: 12,
    publishedAt: "2026-01-28",
    tags: ["fusarium", "resistance", "varieties"],
    status: "draft" as const,
  },
]

export default function KnowledgePostsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Knowledge Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Publish educational content, disease guides, and farming tips.
          </p>
        </div>
        <CreatePostModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-card-foreground">{knowledgePosts.length}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-card-foreground">
              {knowledgePosts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-card-foreground">
              {knowledgePosts.reduce((sum, p) => sum + p.likes, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {knowledgePosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      post.status === "published"
                        ? "border-primary/50 text-primary"
                        : "border-accent/50 text-accent-foreground"
                    }`}
                  >
                    {post.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="font-semibold text-base text-card-foreground mb-1.5 text-balance">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.comments}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
