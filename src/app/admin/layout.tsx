import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNavbar children={children} />
    </div>
  );
}
