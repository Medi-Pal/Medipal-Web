import Link from "next/link";

export default function () {
  return (
    <div className="flex flex-col max-w-fit gap-3 justify-center p-8 border-2 rounded-2xl shadow-lg">
      <h2 className="text text-2xl font-extrabold text-center">
        Reset Password
      </h2>
      <label className="label label-text font-bold">
        Enter your new password
      </label>
      <input type="password" className="input input-bordered" />
      <label className="label label-text font-bold">Confirm Password</label>
      <input type="password" className="input input-bordered" />
      <button className="btn btn-primary">Change</button>
    </div>
  );
}
