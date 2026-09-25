import { Link } from "@tanstack/react-router";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="IONMAN Workforce home">
      <span
        className={`grid place-items-center rounded-md bg-brand font-display font-extrabold text-accent ${
          small ? "size-6 text-xs" : "size-8 text-lg"
        }`}
      >
        I
      </span>
      <span className={`font-display font-bold tracking-tight ${small ? "text-sm" : "text-xl"}`}>
        IONMAN<span className="text-accent"> Workforce</span>
      </span>
    </Link>
  );
}
