import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { href: "/#sectors", label: "Sectors" },
  { href: "/#process", label: "How it works" },
  { href: "/#employers", label: "For employers" },
];

export function Nav() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-8 lg:px-14 lg:py-6">
      <Logo />
      <div className="hidden items-center gap-8 text-sm font-medium md:flex">
        <Link to="/jobs" className="transition-colors hover:text-accent">
          Jobs
        </Link>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-accent">
            {l.label}
          </a>
        ))}
      </div>
      <a
        href="/#cv"
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
      >
        Leave your CV
      </a>
    </nav>
  );
}
