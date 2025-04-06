"use client";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminAuthGuard from "@/app/components/AdminAuthGuard";
import { ReactNode, useState, createContext, useContext } from "react";

// Create a context to share the search query across components
export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: (query: string) => { },
});

export function useSearch() {
  return useContext(SearchContext);
}

export default function ({ children }: { children: ReactNode }) {
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
