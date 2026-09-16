"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/semanal", label: "Semanal" },
  { href: "/diario", label: "Diario" },
  { href: "/eventos", label: "Eventos" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="tabs">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
