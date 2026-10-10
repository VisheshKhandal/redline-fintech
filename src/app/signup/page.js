import { publicMetadata } from "@/lib/seo";
import AuthPage from "@/components/redline/auth-page";

export const metadata = publicMetadata("Create account","Create a Redline account to explore financial analytics and portfolio tools. Market data and performance are illustrative examples.","/signup");

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
