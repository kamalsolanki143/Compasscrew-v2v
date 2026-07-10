"use client";
import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" />
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.SIGNUP} className="text-rose-500 hover:text-rose-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
