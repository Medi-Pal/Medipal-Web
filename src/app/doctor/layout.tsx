"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DoctorNavbar from "@/app/components/DoctorNavbar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DoctorNavbar title="Medipal">
      <main className="min-h-screen bg-white">
        {children}
      </main>
    </DoctorNavbar>
  );
}
