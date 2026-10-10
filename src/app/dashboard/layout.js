import DashboardShell from "@/components/redline/dashboard-shell";
export const metadata = { title: "Workspace", robots: { index: false, follow: false }, alternates: { canonical: null } };
export default function DashboardLayout({ children }) { return <DashboardShell>{children}</DashboardShell>; }
