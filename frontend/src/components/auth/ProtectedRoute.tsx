"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  getAuthSession,
  getDashboardPath,
  type AuthSession,
  type UserRole,
} from "@/lib/auth";

type ProtectedRouteProps = {
  allowedRole?: UserRole;
  children: (session: AuthSession) => ReactNode;
};

export default function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const currentSession = getAuthSession();

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    const userRole: UserRole = currentSession.user.role;

    if (allowedRole && userRole !== allowedRole) {
      router.replace(getDashboardPath(userRole));
      return;
    }

    setSession(currentSession);
    setIsChecking(false);
  }, [allowedRole, router]);

  if (isChecking) {
    return (
      <section className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="border border-[#111111]/10 bg-white px-5 py-3 text-sm font-medium text-stone-600 shadow-soft">
          Checking your account...
        </p>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children(session)}</>;
}
