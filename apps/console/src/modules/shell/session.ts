import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

// Until sign-in exists, the console runs as a fixed demo user in one workspace.
export const demoUser = { name: "Priya Raman", email: "priya.raman@example.com" };
export const demoWorkspaces = [{ id: "ws-default", name: "Default workspace" }];

const noCounts = { reviews: 0, approvals: 0, notifications: 0 };

/** Items waiting for the user (dots on Reviews and Approvals, unread bell). */
export function useInboxCounts() {
  const query = useQuery({
    queryKey: ["inbox-counts"],
    queryFn: async () => {
      const { data, error } = await api.GET("/api/inbox/counts");
      if (error || !data) throw new Error("inbox counts unavailable");
      return data;
    },
    retry: false,
    staleTime: 30_000,
  });
  return query.data ?? noCounts;
}
