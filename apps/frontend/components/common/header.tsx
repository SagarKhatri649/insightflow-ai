// import { Link } from "lucide-react";
import Link from 'next/link';
export default function Header (){
  return (
    <nav className="container flex items-center justify-between">
      <div>
        <Link href="/">Insightflow</Link>
      </div>

      <div>
        <Link href="/#Pricing">Pricing</Link>
      </div>

      <div>
        <Link href="/sign-in">Sign In</Link>
      </div>
    </nav>

  );
}