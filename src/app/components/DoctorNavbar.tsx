"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DoctorNavbar({
  children,
  title = "Medipal",
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      // Clear any local storage or state if needed
      localStorage.clear();
      // Force a hard redirect to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      router.push("/login");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-primary text-white w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-3xl">{title}</span>
            {session.user?.name && (
              <span className="text-lg ml-4 opacity-90">
                Dr. {session.user.name}
              </span>
            )}
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal items-center gap-2">
              <li>
                <Link
                  className="text text-lg hover:bg-primary-focus"
                  href="/doctor/history"
                >
                  Past Prescriptions
                </Link>
              </li>
              <li>
                <Link
                  className="text text-lg hover:bg-primary-focus"
                  href="/doctor/prescription"
                >
                  Create Prescription
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm text-white hover:bg-error-focus"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-primary min-h-full w-80 p-4 gap-4">
          {session.user?.name && (
            <li className="text-white text-xl mb-4 px-4">
              Dr. {session.user.name}
            </li>
          )}
          <SideBarItem name="Past Prescriptions" href="/doctor/history" />
          <SideBarItem
            name="Create Prescription"
            href="/doctor/prescription"
          />
          <li>
            <button
              onClick={handleLogout}
              className="text text-xl text-white hover:bg-error"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SideBarItem({ name, href }: { name: string; href: string }) {
  return (
    <li>
      <Link className="text text-xl text-white hover:bg-primary-focus" href={href}>
        {name}
      </Link>
    </li>
  );
}
