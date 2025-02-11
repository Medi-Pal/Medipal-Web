import AdminLogin from "@/app/components/AdminLogin";

export default function () {
  return (
    <div className="flex justify-center items-center flex-col p-10 gap-8">
      <p className="text text-5xl mb-5">Admin Login</p>
      <AdminLogin />
    </div>
  );
}
