import { Link } from "@tanstack/react-router";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="IONMAN Workforce home">
      <span
        className={`grid shrink-0 place-items-center rounded-md bg-brand font-display font-extrabold text-accent ${
          small ? "size-6 text-xs" : "size-8 text-lg"
        }`}
      >
        I
      </span>
      <span className={`min-w-0 font-display font-bold ${small ? "text-sm" : "text-base sm:text-xl"}`}>
        IONMAN<span className="text-accent"> Workforce</span>
      </span>
    </Link>
  );
}
