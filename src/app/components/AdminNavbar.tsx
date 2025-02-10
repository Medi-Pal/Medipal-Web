import Link from "next/link";
import { ReactNode } from "react";

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full">
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
          <div className="mx-2 flex-1 px-2 text-3xl">Administrator</div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              <li>
                <Link
                  className="text text-l"
                  href={"/admin/doctor/registration"}
                >
                  Registrations
                </Link>
              </li>
              <li>
                <Link className="text text-l" href={"/admin/doctor"}>
                  Approved
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 gap-4">
          <SideBarItem
            name={"Registrations"}
            href={"/admin/doctor/registration"}
          />
          <SideBarItem name={"Approved"} href={"/admin/doctor"} />
        </ul>
      </div>
    </div>
  );
}

function SideBarItem({ name, href }: { name: String; href: String }) {
  return (
    <li>
      <Link className="text text-xl" href={`${href}`}>
        {name}
      </Link>
    </li>
  );
}
