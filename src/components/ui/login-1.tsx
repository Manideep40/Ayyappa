import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Login1Props {
  heading?: string;
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  onGoogle?: () => void;
}

const Login1 = ({
  heading = "Sign in",
  buttonText = "Login",
  googleText = "Sign in with Google",
  signupText = "Don't have an account?",
  signupUrl = "/get-started",
  onGoogle,
}: Login1Props) => {
  return (
    <section className="bg-muted bg-background min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-10 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {heading && <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{heading}</h1>}
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input type="email" placeholder="Email" required />
              </div>
              <div className="flex flex-col gap-2">
                <Input type="password" placeholder="Password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="mt-1 w-full">
                  {buttonText}
                </Button>
                <Button variant="outline" className="w-full" onClick={onGoogle}>
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <a href={signupUrl} className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
