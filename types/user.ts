// tomato-classification-frontend/types/user.ts
export type User = {
    id: number
    username: string
    email: string
    role: Role
    is_verified: boolean
}

export enum Role {
    FARMER = "farmer",
    EXPERT = "expert",
    ADMIN = "admin",
}