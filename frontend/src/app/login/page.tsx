"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { getAuthSession, getDashboardPath } from "@/lib/auth";

const imageUrl =
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=85";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getAuthSession();
    if (session) router.replace(getDashboardPath(session.user.role));
  }, [router]);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 xl:px-10">
      <div className="hidden h-[620px] overflow-hidden lg:block">
        <img src={imageUrl} alt="Wedding table setting" className="h-full w-full object-cover" />
      </div>
      <div className="bg-white p-6 shadow-soft sm:p-10">
        <p className="text-sm font-semibold uppercase text-stone-500">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">Login</h1>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-stone-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#111111] underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
