import Link from "next/link";

export default function () {
  return (
    <div className="flex flex-col max-w-fit gap-3 justify-center p-5 border-2 shadow-lg">
      <h2 className="text text-2xl font-extrabold text-center">
        Forgot Password
      </h2>
      <p className="text text-sm">
        Enter your email below to reset your password
      </p>
      <p className="text text-sm font-bold">Email</p>
      <input
        type="mail"
        className="input input-bordered"
        name=""
        id=""
        placeholder={"m@example.com"}
      />
      <button className="btn btn-primary">Submit</button>
      <Link href={"login"} className="text text-sm underline font-semibold">
        Back to login
      </Link>
    </div>
  );
}
