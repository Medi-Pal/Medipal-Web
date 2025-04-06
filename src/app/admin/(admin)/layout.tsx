"use client";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminAuthGuard from "@/app/components/AdminAuthGuard";
import { ReactNode, useState } from "react";
import { SearchContext } from "./searchContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <AdminAuthGuard>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <div className="min-h-screen bg-white">
          <AdminNavbar title="Administrator" onSearch={handleSearch}>
            {children}
          </AdminNavbar>
        </div>
      </SearchContext.Provider>
    </AdminAuthGuard>
  );
}
