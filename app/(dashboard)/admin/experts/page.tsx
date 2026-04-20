"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, UserCheck, UserRoundCheck } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserDataTable } from "@/components/admin/user-data-table"
import { createPendingExpertColumns, userColumns } from "@/components/admin/usercolumn"
import {
  AdminUser,
  approveExpert,
  fetchApprovedExperts,
  fetchPendingExperts,
  rejectExpert,
} from "@/lib/api/user"

export default function AdminExpertsPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [approvingUserId, setApprovingUserId] = useState<number | null>(null)
  const [rejectingUserId, setRejectingUserId] = useState<number | null>(null)

  const {
    data: approvedExperts = [],
    isLoading: isApprovedLoading,
    isError: isApprovedError,
  } = useQuery({
    queryKey: ["admin", "experts", "approved"],
    queryFn: fetchApprovedExperts,
  })

  const {
    data: pendingExperts = [],
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useQuery({
    queryKey: ["admin", "experts", "pending"],
    queryFn: fetchPendingExperts,
  })

  const search = (searchParams.get("search") ?? "").trim().toLowerCase()
  const filteredApprovedExperts = approvedExperts.filter((expert) => (
    search === "" ||
    expert.username.toLowerCase().includes(search) ||
    expert.email.toLowerCase().includes(search) ||
    expert.role.toLowerCase().includes(search)
  ))
  const filteredPendingExperts = pendingExperts.filter((expert) => (
    search === "" ||
    expert.username.toLowerCase().includes(search) ||
    expert.email.toLowerCase().includes(search) ||
    expert.role.toLowerCase().includes(search)
  ))
  const isLoading = isApprovedLoading || isPendingLoading

  const syncExpertLists = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "experts", "approved"] })
    await queryClient.invalidateQueries({ queryKey: ["admin", "experts", "pending"] })
    await queryClient.invalidateQueries({ queryKey: ["top-nav", "experts"], exact: false })
  }

  const approveMutation = useMutation({
    mutationFn: approveExpert,
    onSuccess: async () => {
      toast.success("Expert approved successfully.")
      await syncExpertLists()
    },
    onError: () => {
      toast.error("Unable to approve expert.")
    },
    onSettled: () => {
      setApprovingUserId(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: rejectExpert,
    onSuccess: async () => {
      toast.success("Expert rejected successfully.")
      await syncExpertLists()
    },
    onError: () => {
      toast.error("Unable to reject expert.")
    },
    onSettled: () => {
      setRejectingUserId(null)
    },
  })

  const handleApprove = (expert: AdminUser) => {
    if (!expert.id) {
      toast.error("Expert id is missing.")
      return
    }

    setApprovingUserId(expert.id)
    approveMutation.mutate(expert.id)
  }

  const handleReject = (expert: AdminUser) => {
    if (!expert.id) {
      toast.error("Expert id is missing.")
      return
    }

    setRejectingUserId(expert.id)
    rejectMutation.mutate(expert.id)
  }

  const pendingColumns = useMemo(
    () =>
      createPendingExpertColumns({
        onApprove: handleApprove,
        onReject: handleReject,
        approvingUserId,
        rejectingUserId,
      }),
    [approvingUserId, rejectingUserId]
  )

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Experts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review approved experts and pending expert accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {filteredApprovedExperts.length + filteredPendingExperts.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Experts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent/20 flex items-center justify-center">
              <UserRoundCheck className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{filteredApprovedExperts.length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{filteredPendingExperts.length}</p>
              <p className="text-xs text-muted-foreground">Need Approval</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="w-full h-[45vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Tabs defaultValue="approved" className="gap-4">
          <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="approved"
              className="relative rounded-none border-0 bg-transparent px-0 py-3 mr-6 shadow-none transition-all duration-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100"
            >
              Approved Experts
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="relative rounded-none border-0 bg-transparent px-0 py-3 shadow-none transition-all duration-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100"
            >
              Need to Approve
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            {isApprovedError ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Unable to load approved experts.
                </CardContent>
              </Card>
            ) : (
              <UserDataTable
                columns={userColumns}
                data={filteredApprovedExperts}
                emptyMessage="No approved experts found."
              />
            )}
          </TabsContent>

          <TabsContent value="pending" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            {isPendingError ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Unable to load pending experts.
                </CardContent>
              </Card>
            ) : (
              <UserDataTable
                columns={pendingColumns}
                data={filteredPendingExperts}
                emptyMessage="No experts are waiting for approval."
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
