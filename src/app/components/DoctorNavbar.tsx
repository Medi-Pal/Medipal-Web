import Link from "next/link";
import { ReactNode } from "react";

export default function ({
  children,
  title = "Doctor",
}: {
  title: string;
  children: ReactNode;
}) {
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
                fill="none"
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
          <div className="mx-2 px-2 text-3xl flex-1">{title}</div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal items-center">
              <li>
                <Link
                  className="text text-lg focus:bg-base-100"
                  href={"/doctor/history"}
                >
                  Past Prescriptions
                </Link>
              </li>
              <li>
                <Link
                  className="text text-lg focus:bg-base-100"
                  href={"/doctor/prescription"}
                >
                  Create Prescription
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-primary min-h-full w-80 p-4 gap-4">
          <SideBarItem name={"Past Prescriptions"} href={"/doctor/history"} />
          <SideBarItem
            name={"Create Prescription"}
            href={"/doctor/prescription"}
          />
        </ul>
      </div>
    </div>
  );
}

function SideBarItem({ name, href }: { name: String; href: String }) {
  return (
    <li>
      <Link className="text text-xl text-white" href={`${href}`}>
        {name}
      </Link>
    </li>
  );
}
