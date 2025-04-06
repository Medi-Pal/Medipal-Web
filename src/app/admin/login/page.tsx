import AdminLogin from "@/app/components/AdminLogin";

export default function () {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white">
      <div className="w-full max-w-md space-y-8 bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Medipal</h1>
          <p className="mt-2 text-gray-600">Admin Portal</p>
        </div>
        <AdminLogin />
      </div>
    </div>
  );
}
