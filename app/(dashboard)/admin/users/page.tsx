"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { UserDataTable } from "@/components/admin/user-data-table"
import { userColumns } from "@/components/admin/usercolumn"
import { fetchUsers } from "@/lib/api/user"

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  })

  const search = (searchParams.get("search") ?? "").trim().toLowerCase()
  const filteredUsers = users.filter((user) => (
    search === "" ||
    user.username.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.role.toLowerCase().includes(search)
  ))

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View all registered TomatoCare accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{filteredUsers.length}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="w-full h-[45vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Unable to load users. Please try again.
          </CardContent>
        </Card>
      ) : (
        <UserDataTable columns={userColumns} data={filteredUsers} />
      )}
    </div>
  )
}
