import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type Ev = { id: string; created_at: string; action: string; job_slug: string | null; title: string; city: string | null; country: string | null };

function ago(iso: string, ro: boolean) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return ro ? "acum" : "just now";
  if (m < 60) return ro ? `acum ${m} min` : `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return ro ? `acum ${h} h` : `${h}h ago`;
  return new Date(iso).toLocaleDateString(ro ? "ro-RO" : "en-GB");
}

export function JobFeed() {
  const { t, lang } = useLang();
  const ro = lang === "ro";
  const [events, setEvents] = useState<Ev[]>([]);
  const [, tick] = useState(0);

  useEffect(() => {
    supabase.from("job_post_events").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => data && setEvents(data as Ev[]));
    const ch = supabase.channel("job-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_post_events" },
        (p) => setEvents((e) => [p.new as Ev, ...e].slice(0, 8)))
      .subscribe();
    const iv = setInterval(() => tick((n) => n + 1), 60000);
    return () => { supabase.removeChannel(ch); clearInterval(iv); };
  }, []);

  const label = (a: string) =>
    a === "published" ? t("New job", "Post nou") : a === "updated" ? t("Updated", "Actualizat") : t("Closed", "Închis");

  return (
    <section className="px-6 pt-8 pb-0 md:px-8 lg:px-14">
      <div className="border-b border-border pb-6">
        <div className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-accent" /></span>
          {t("Live job updates", "Actualizări în timp real")}
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-brand/60">{t("New and updated job posts will appear here the moment they go live.", "Posturile noi și actualizate vor apărea aici imediat ce sunt publicate.")}</p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.action === "removed" ? "bg-brand/10 text-brand/60" : "bg-accent/15 text-accent"}`}>{label(e.action)}</span>
                {e.job_slug && e.action !== "removed" ? (
                  <Link to="/jobs/$slug" params={{ slug: e.job_slug }} className="font-medium hover:text-accent">{e.title}</Link>
                ) : <span className="font-medium text-brand/60 line-through">{e.title}</span>}
                <span className="text-brand/50">{[e.city, e.country].filter(Boolean).join(", ")}</span>
                <span className="ml-auto text-xs text-brand/40">{ago(e.created_at, ro)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
