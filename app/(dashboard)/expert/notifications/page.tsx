"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, ThumbsUp, AlertTriangle, CheckCheck, HelpCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "question" as const,
    message: "New farmer question: 'Yellow spots on my tomato leaves - help!'",
    time: "1 hour ago",
    read: false,
    initials: "JK",
  },
  {
    id: 2,
    type: "comment" as const,
    message: "James Mwangi thanked your advice on early blight treatment.",
    time: "3 hours ago",
    read: false,
    initials: "JM",
  },
  {
    id: 3,
    type: "like" as const,
    message: "Your knowledge post received 15 new likes today.",
    time: "6 hours ago",
    read: true,
    initials: "TC",
  },
  {
    id: 4,
    type: "alert" as const,
    message: "Disease outbreak: Increased Late Blight reports in the region.",
    time: "1 day ago",
    read: true,
    initials: "AL",
  },
]

const iconMap = {
  question: HelpCircle,
  comment: MessageCircle,
  like: ThumbsUp,
  alert: AlertTriangle,
}

export default function ExpertNotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""} need your attention.` : "All caught up!"}
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
