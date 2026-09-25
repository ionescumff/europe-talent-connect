import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-brand/10 px-6 py-10 text-sm text-brand/60 md:px-8 lg:px-14">
      <div className="grid gap-8 md:grid-cols-[1.35fr_1fr_1fr]">
        <div>
          <Logo small />
          <p className="mt-4 max-w-sm leading-6">
            European workforce recruitment from Romania for employers and staffing partners in the
            Netherlands and Germany.
          </p>
          <div className="mt-4 space-y-1 text-xs leading-5">
            <p>ION MAN WORKFORCE S.R.L. · Romania</p>
            <p>Trade Register: J2022021461408 · CUI/VAT: 47083118</p>
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">Contact</p>
          <div className="mt-3 flex flex-col items-start gap-2">
            <a href="mailto:contact@imworkforce.eu" className="hover:text-brand">contact@imworkforce.eu</a>
            <a href="mailto:recruitment@imworkforce.eu" className="hover:text-brand">recruitment@imworkforce.eu</a>
            <a href="tel:+40741699011" className="hover:text-brand">+40 741 699 011 · Phone/WhatsApp</a>
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">Information</p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 md:grid-cols-1">
            <Link to="/contact" className="hover:text-brand">Company &amp; contact</Link>
            <Link to="/privacy" className="hover:text-brand">Privacy &amp; cookies</Link>
            <Link to="/terms" className="hover:text-brand">Terms</Link>
            <Link to="/eu-candidate-information" className="hover:text-brand">EU candidate information</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t border-brand/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ION MAN WORKFORCE S.R.L. All rights reserved.</p>
        <Link to="/portal" className="font-semibold text-brand/45 transition-colors hover:text-brand">
          Staff CRM
        </Link>
      </div>
    </footer>
  );
}
