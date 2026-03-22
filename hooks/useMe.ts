// hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { fetchMe } from "@/lib/api/user";

export const useMe = (enabled = true) =>
  useQuery<User>({
    queryKey: ["users", "me"],
    queryFn: fetchMe,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });