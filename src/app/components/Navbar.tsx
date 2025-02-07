import Link from "next/link";

export default function () {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-3xl" href="/">
          Medi-Pal
        </Link>
      </div>
    </div>
  );
}
