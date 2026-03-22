"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, MessageCircle, ThumbsUp, AlertTriangle, CheckCheck } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "comment" as const,
    message: "Dr. Sarah Otieno commented on your post about yellow spots.",
    time: "2 hours ago",
    read: false,
    initials: "SO",
  },
  {
    id: 2,
    type: "like" as const,
    message: "Your post received 10 new likes.",
    time: "5 hours ago",
    read: false,
    initials: "TC",
  },
  {
    id: 3,
    type: "alert" as const,
    message: "Late Blight alert: High risk conditions detected in your area.",
    time: "1 day ago",
    read: true,
    initials: "AL",
  },
  {
    id: 4,
    type: "comment" as const,
    message: "John Kamau replied to your comment about fusarium wilt recovery.",
    time: "2 days ago",
    read: true,
    initials: "JK",
  },
  {
    id: 5,
    type: "like" as const,
    message: "Prof. Amina Hassan liked your post.",
    time: "3 days ago",
    read: true,
    initials: "AH",
  },
]

const iconMap = {
  comment: MessageCircle,
  like: ThumbsUp,
  alert: AlertTriangle,
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up!"}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type]
          return (
            <Card
              key={notification.id}
              className={`transition-colors ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {notification.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notification.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
