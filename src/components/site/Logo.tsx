export function Logo({ small = false }: { small?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2">
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
    </a>
  );
}
