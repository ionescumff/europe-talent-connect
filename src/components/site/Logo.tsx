import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/ionman-logo.png.asset.json";

// Set to false to switch back to the old text logo everywhere.
const USE_IMAGE_LOGO = true;

export function Logo({ small = false }: { small?: boolean }) {
  if (USE_IMAGE_LOGO) {
    return (
      <Link to="/" className="flex min-w-0 items-center" aria-label="IONMAN Workforce home">
        <img
          src={logoAsset.url}
          alt="IONMAN Workforce"
          className={`w-auto shrink-0 ${small ? "h-7" : "h-9 sm:h-10"}`}
        />
      </Link>
    );
  }
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
