import { Badge } from "@/components/ui/badge"
import { Role } from "@/types/user"
import { Leaf, GraduationCap } from "lucide-react"

export function UserBadge({ role }: { role: Role }) {
  if (role === "expert") {
    return (
      <Badge className="bg-accent text-accent-foreground gap-1 text-xs font-medium">
        <GraduationCap className="h-3 w-3" />
        Expert
      </Badge>
    )
  }

  else if (role === "admin") {
    return (
      <Badge className="bg-destructive text-white gap-1 text-xs font-medium">
        Admin
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="gap-1 text-xs font-medium">
      <Leaf className="h-3 w-3" />
      Farmer
    </Badge>
  )
}
