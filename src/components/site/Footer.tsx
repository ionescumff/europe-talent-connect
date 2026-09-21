import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative flex flex-col items-center justify-between gap-4 border-t border-brand/10 px-6 py-8 text-sm text-brand/60 md:flex-row md:px-8 lg:px-14">
      <div className="flex items-center gap-3">
        <Logo small />
        <span className="hidden md:inline">· Netherlands &amp; Romania</span>
      </div>
      <div className="flex gap-6">
        <a href="#sectors" className="hover:text-brand">Sectors</a>
        <a href="#employers" className="hover:text-brand">For employers</a>
        <a href="#cv" className="hover:text-brand">Leave your CV</a>
      </div>
    </footer>
  );
}
