"use client";

import LoginForm from "@/app/components/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/doctor/prescription");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white">
      <div className="w-full max-w-md space-y-8 bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Medipal</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
