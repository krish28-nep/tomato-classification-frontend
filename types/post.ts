import { User } from "./user"

export type Post = {
    id: number
    title: string
    content: string
    image: string
    like: number
    dislike: number
    total_comments: number,
    create_at: string
    updatedAt: string
    user: User
    comments: Comment[]
}

export interface PaginatedPostsResponse {
    posts: Post[]
    limit: number
    total: number
    hasMore: boolean
    nextCursor: string | null
}

export interface Comment {
    id: number
    content: string
    user?: User
    image?: string
    created_at: string
    total_replies: number
    like: number
    dislike: number
    children?: Comment[]
}
