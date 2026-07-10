"use client";
import SignupForm from "@/components/forms/SignupForm";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/constants/routes";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" />
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join EscapeHer for your safety
          </p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="text-rose-500 hover:text-rose-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
