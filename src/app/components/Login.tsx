import LoginForm from "./LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex justify-center items-center flex-col p-10 gap-8">
      <p className="text text-5xl mb-5">Login</p>
      <LoginForm />
      <p className="text text-xl">
        New User?{" "}
        <Link href="register" className="link link-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
