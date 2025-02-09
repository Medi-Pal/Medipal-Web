export default function Unverified() {
  return (
    <div className="flex flex-col p-10 items-center justify-center gap-4">
      <p className="text text-3xl font-bold">
        Your registration status is pending.
      </p>
      <p className="text text-xl">
        It is under review by us. Contact the admin for more information.
      </p>
    </div>
  );
}
