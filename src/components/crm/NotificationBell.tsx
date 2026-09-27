import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Notification = {
  id: string;
  created_at: string;
  title: string;
  body: string | null;
  entity: string | null;
  entity_id: string | null;
  actor_email: string | null;
  read: boolean;
};

async function fetchNotifications(): Promise<Notification[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase
    .from("staff_notifications")
    .select("id, created_at, title, body, entity, entity_id, actor_email, read")
    .eq("user_id", u.user.id)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export function NotificationBell() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const seen = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  const items = q.data ?? [];
  const unread = items.filter((n) => !n.read).length;

  // Pop a toast when something new arrives while the page is open.
  useEffect(() => {
    if (!q.data) return;
    if (!primed.current) {
      q.data.forEach((n) => seen.current.add(n.id));
      primed.current = true;
      return;
    }
    q.data
      .filter((n) => !seen.current.has(n.id))
      .forEach((n) => {
        seen.current.add(n.id);
        if (!n.read) toast(n.title, { description: n.body ?? undefined });
      });
  }, [q.data]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function markRead(ids: string[]) {
    if (!ids.length) return;
    await supabase.from("staff_notifications").update({ read: true }).in("id", ids);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function openItem(n: Notification) {
    setOpen(false);
    await markRead([n.id]);
    if (n.entity === "cv_submissions" && n.entity_id) {
      navigate({ to: "/crm/candidates/$id", params: { id: n.entity_id } });
    } else if (n.entity === "vacancy_enquiries") {
      navigate({ to: "/crm/employers" });
    } else {
      navigate({ to: "/crm/my" });
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-full border border-glass-border px-3 py-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-card absolute right-0 z-50 mt-2 w-80 max-w-[92vw] overflow-hidden p-0 text-left">
          <div className="flex items-center justify-between border-b border-glass-border px-4 py-3">
            <span className="font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => markRead(items.filter((n) => !n.read).map((n) => n.id))}
                className="text-xs text-muted-foreground hover:text-accent"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 divide-y divide-glass-border overflow-y-auto">
            {items.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing yet.</p>}
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => openItem(n)}
                className={`block w-full px-4 py-3 text-left text-sm hover:bg-glass ${n.read ? "opacity-60" : ""}`}
              >
                <span className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  <span>
                    <span className="block font-semibold">{n.title}</span>
                    {n.body && <span className="block text-muted-foreground">{n.body}</span>}
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("en-GB")}
                      {n.actor_email ? ` · by ${n.actor_email}` : ""}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
