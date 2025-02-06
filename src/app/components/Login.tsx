import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div className="flex justify-center items-center flex-col p-10 gap-20">
      <p className="text text-5xl mb-5">Login</p>
      <LoginForm />
    </div>
  );
}
