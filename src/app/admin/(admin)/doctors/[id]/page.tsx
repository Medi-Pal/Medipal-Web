import EditDoctorDetails from "@/app/components/EditDoctor";

export default function () {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Manage Doctor</h1>
        <EditDoctorDetails />
      </div>
    </div>
  );
}
