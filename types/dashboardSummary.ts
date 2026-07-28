export type ExpertDashboardSummary = {
    total_farmers: number
    total_posts: number
    total_comments: number
}

export type FarmerDashboardSummmary = {
    total_posts: number
    total_comments: number
}

export type FarmerDashboardSummary = FarmerDashboardSummmary

export type AdminDashboardSummary = {
    total_farmers: number
    total_experts: number
    total_users: number
    total_posts: number
    total_comments: number
}

export type DashboardSummary =
    | AdminDashboardSummary
    | ExpertDashboardSummary
    | FarmerDashboardSummary
