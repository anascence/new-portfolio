import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="missing">
      <h1 className="section-title">This page doesn’t exist.</h1>
      <Image src="/media/lain404.png" alt="404 illustration" width={700} height={700} />
      <Link className="button" href="/">Back to the portfolio</Link>
    </main>
  );
}
