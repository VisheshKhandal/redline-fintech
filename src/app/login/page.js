import { publicMetadata } from "@/lib/seo";
import AuthPage from "@/components/redline/auth-page";

export const metadata = publicMetadata("Sign in","Sign in to Redline to explore portfolio analytics and financial visualizations with clearly labeled demo market data.","/login");

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
