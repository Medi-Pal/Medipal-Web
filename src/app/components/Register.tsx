import RegistrationForm from "./RegistrationForm";
import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white">
      <div className="w-full max-w-md space-y-8 bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Medipal</h1>
          <p className="mt-2 text-gray-600">Create a new doctor account</p>
        </div>
        <RegistrationForm />
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already Registered?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
