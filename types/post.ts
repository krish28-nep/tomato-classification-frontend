import { User } from "./user"

export type Post = {
    id: number
    title: string
    content: string
    image: string
    like: number
    dislike: number
    create_at: string
    updatedAt: string
    user: User
    comments: Comment[]
}

export interface Comment {
    id: number
    content: string
    user: User
    image: string
    created_at: string
    like: number
    dislike: number
    children?: Comment[]
}