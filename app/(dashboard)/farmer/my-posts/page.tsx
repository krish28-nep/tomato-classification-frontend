"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, MessageCircle, ThumbsUp, Clock } from "lucide-react"
import { CreatePostModal } from "@/components/create-post-modal"
import { toast } from "sonner"
import { PaginatedPostsResponse } from "@/types/post"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { deletePost, fetchPostByUserId } from "@/lib/api/post"
import { ImageGallery } from "@/components/image-gallery"
import { showErrorToast } from "@/lib/showErrorToast"

export default function MyPostsPage() {
  const { user } = useAuth()
  const { data } = useQuery<PaginatedPostsResponse>({
    queryKey: ["posts", user?.email],
    queryFn: () => fetchPostByUserId({ limit: 50 }),
    enabled: !!user
  })

  const queryClient = useQueryClient();

  const deletMutation = useMutation(({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted sucesfully")
    },
    onError: (err) => showErrorToast((err))
  }))

  const handleDelete = async (id: number) => {
    await deletMutation.mutateAsync(id)
  }

  const myPosts = data?.posts ?? []
  const totalPosts = data?.total ?? myPosts.length

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">My Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your posts and track engagement.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalPosts} total posts
          </p>
        </div>
        <CreatePostModal />
      </div>

      {myPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {myPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0 ">
                    <h3 className="font-semibold text-base text-card-foreground text-balance">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit post</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete post</span>
                    </Button>
                  </div>

                </div>
                {post.image && (
                  <div className="mt-3">
                    <ImageGallery title={post.title} images={[post.image]} />
                  </div>
                )}
                {/**/}
                {/* {post.tags.length > 0 && ( */}
                {/*   <div className="flex flex-wrap gap-1.5 mb-3"> */}
                {/*     {post.tags.map((tag) => ( */}
                {/*       <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground"> */}
                {/*         {tag} */}
                {/*       </Badge> */}
                {/*     ))} */}
                {/*   </div> */}
                {/* )} */}

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {post.like}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(post.create_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Edit className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">No posts yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first post to get started.</p>
        </div>
      )}
    </div>
  )
}
