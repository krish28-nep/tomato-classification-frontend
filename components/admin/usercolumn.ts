import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminUser } from "@/lib/api/user"
import { AdminTableColumn } from "@/components/admin/table-types"

export const userColumns: AdminTableColumn<AdminUser>[] = [
  {
    key: "serialNumber",
    header: "S.N",
    cell: (_, index) =>
      React.createElement("span", { className: "text-muted-foreground" }, index + 1),
  },
  {
    key: "username",
    header: "Name",
    cell: (user) =>
      React.createElement(
        "div",
        null,
        React.createElement("p", { className: "font-medium text-card-foreground" }, user.username),
        React.createElement("p", { className: "text-xs text-muted-foreground sm:hidden" }, user.email)
      ),
  },
  {
    key: "email",
    header: "Email",
    cell: (user) =>
      React.createElement("span", { className: "text-muted-foreground" }, user.email),
  },
  {
    key: "role",
    header: "Role",
    cell: (user) =>
      React.createElement(Badge, { variant: "outline", className: "capitalize" }, user.role),
  },
  {
    key: "online",
    header: "Status",
    cell: (user) =>
      React.createElement(
        Badge,
        {
          variant: user.online ? "default" : "outline",
          className: user.online ? "" : "text-muted-foreground",
        },
        user.online ? "Online" : "Offline"
      ),
  },
]

type PendingExpertColumnOptions = {
  onApprove: (user: AdminUser) => void
  onReject: (user: AdminUser) => void
  approvingUserId?: number | null
  rejectingUserId?: number | null
}

export const createPendingExpertColumns = ({
  onApprove,
  onReject,
  approvingUserId,
  rejectingUserId,
}: PendingExpertColumnOptions): AdminTableColumn<AdminUser>[] => [
  ...userColumns,
  {
    key: "actions",
    header: "Actions",
    cell: (user) =>
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement(
          Button,
          {
            size: "sm",
            className: "h-8",
            disabled: !user.id || approvingUserId === user.id || rejectingUserId === user.id,
            onClick: () => onApprove(user),
          },
          approvingUserId === user.id ? "Approving..." : "Approve"
        ),
        React.createElement(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "h-8 border-destructive/30 text-destructive hover:text-destructive",
            disabled: !user.id || approvingUserId === user.id || rejectingUserId === user.id,
            onClick: () => onReject(user),
          },
          rejectingUserId === user.id ? "Rejecting..." : "Reject"
        )
      ),
  },
]
