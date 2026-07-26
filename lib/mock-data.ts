export type UserRole = "user" | "expert" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  bio: string
  postsCount: number
  commentsCount: number
  joinedAt: string
}

export interface PostImage {
  id: string
  url: string
  alt: string
}

export interface Comment {
  id: string
  content: string
  user: User
  images: PostImage[]
  createdAt: string
  likes: number
  dislikes: number
}

export interface Post {
  id: string
  title: string
  content: string
  user: User
  images: PostImage[]
  comments: Comment[]
  likes: number
  dislikes: number
  commentsCount: number
  createdAt: string
}

export interface DiseaseResult {
  name: string
  confidence: number
  symptoms: string[]
  prevention: string[]
  cure: string[]
  description: string
}

export const farmerTips = [
  "Water your tomato plants early in the morning to reduce disease risk.",
  "Rotate crops every 2-3 years to break disease cycles.",
  "Inspect leaves regularly for early signs of disease.",
  "Maintain proper spacing between plants for good air circulation.",
  "Use mulch to prevent soil-borne diseases from splashing onto leaves.",
]
