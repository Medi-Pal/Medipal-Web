import AdminNavbar from "@/app/components/AdminNavbar";

export default function ({ children }: { children: React.ReactNode }) {
  return <AdminNavbar title={"Administrator"} children={children} />;
}
