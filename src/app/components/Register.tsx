import RegistrationForm from "./RegistrationForm";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex justify-center items-center flex-col p-4 gap-4">
      <p className="text text-5xl mb-5">Register</p>
      <RegistrationForm />
      <p className="text text-xl">
        Already Registered?{" "}
        <Link href="login" className="link link-primary">
          Log In
        </Link>
      </p>
    </div>
  );
}
