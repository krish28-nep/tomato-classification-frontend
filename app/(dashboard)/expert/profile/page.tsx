"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileText, MessageCircle, Calendar, Mail, Edit } from "lucide-react"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/hooks/useAuth"

export default function ExpertProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const data = {
    postCounts: "12",
    dateJoined: new Date(Date.now()),
    commentsCount: "14"
  }

  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground font-heading">My Profile</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar className="h-20 w-20 border-3 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-card-foreground">{user.username}</h2>
                <UserBadge role={user.role} />
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {new Date(data.dateJoined).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{data.postCounts}</p>
              <p className="text-xs text-muted-foreground">Posts Created</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{data.commentsCount}</p>
              <p className="text-xs text-muted-foreground">Comments Made</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
