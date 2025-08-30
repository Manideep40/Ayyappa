import { Login1 } from "@/components/ui/login-1";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  return (
    <div className="pt-16">
      <Navbar />
      <Login1 heading="Sign in to Ayyappa Seva" onGoogle={loginWithGoogle} />
    </div>
  );
}
