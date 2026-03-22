"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, MessageCircle, Calendar, Mail, Edit, BookOpen, Users } from "lucide-react"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/lib/auth-context"

export default function ExpertProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const initials = user.name
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
            <Avatar className="h-20 w-20 border-3 border-accent/30">
              <AvatarFallback className="bg-accent/10 text-accent-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-card-foreground">{user.name}</h2>
                <UserBadge role={user.role} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">{user.bio}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-card-foreground">{user.postsCount}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-5 w-5 text-accent-foreground mx-auto mb-1" />
            <p className="text-xl font-bold text-card-foreground">{user.commentsCount}</p>
            <p className="text-xs text-muted-foreground">Answers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-card-foreground">4</p>
            <p className="text-xs text-muted-foreground">Guides</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-accent-foreground mx-auto mb-1" />
            <p className="text-xl font-bold text-card-foreground">89</p>
            <p className="text-xs text-muted-foreground">Helped</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive alerts when farmers need help</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-card-foreground">Expert Verification</p>
              <p className="text-xs text-muted-foreground">Your expert status has been verified</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-card-foreground">Account</p>
              <p className="text-xs text-muted-foreground">Manage your account settings</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
