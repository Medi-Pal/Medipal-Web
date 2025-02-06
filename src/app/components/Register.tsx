import RegistrationForm from "./RegistrationForm";

export default function Register() {
  return (
    <div className="flex justify-center items-center flex-col p-10 gap-20">
      <p className="text text-5xl mb-5">Register</p>
      <RegistrationForm />
    </div>
  );
}
