import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

export default function ({
  children,
  title = "Administrator",
  onSearch,
}: {
  title: string;
  children: ReactNode;
  onSearch?: (query: string) => void;
}) {
  // Use local state to track the input value
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // Handle immediate UI updates
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Immediately pass the value to the parent component for real-time filtering
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the cookie on the server
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Also clear the cookie on the client for immediate effect
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to login page
        router.push("/admin/login");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

          {/* Search bar */}
          <div className="flex-1 lg:flex-none lg:w-1/3 mx-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none"
                placeholder="Search doctors..."
                onChange={handleSearchChange}
                value={searchValue}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Title in center for desktop, after search bar for mobile */}
          <div className="mx-2 px-2 text-3xl flex-1 text-center">{title}</div>

          {/* Logout button */}
          <div className="flex-none">
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
                <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
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
          <SideBarItem name={"Doctors"} href={"/admin/doctors"} />
          {/* Logout item in sidebar */}
          <li>
            <a className="text text-xl text-white" onClick={handleLogout}>
              Logout
            </a>
          </li>
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
