import Link from "next/link";

export default function NotFound() {
  return (
    <main className="lost">
      <p className="eyebrow">Signal lost</p>
      <h1>Nothing down here.</h1>
      <Link href="/" className="btn">
        Return to surface
      </Link>
    </main>
  );
}
