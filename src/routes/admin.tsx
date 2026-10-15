import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const title = "Admin Portal & Analytics | American Coffee Shop Oakland Park, FL";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "American Coffee Shop executive analytics and administration portal." },
    ],
  }),
  component: AdminDashboard,
});
