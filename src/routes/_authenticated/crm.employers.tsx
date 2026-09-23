import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/crm/employers")({
  component: Employers,
});

const STATUSES = ["new", "contacted", "proposal", "won", "lost"];

function Employers() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vacancy_enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    await supabase.from("vacancy_enquiries").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Employer leads</h1>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((e) => (
          <div key={e.id} className="glass-card space-y-2 p-5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold">{e.company}</h2>
                <p className="text-muted-foreground">{e.contact_name} · {e.country}</p>
              </div>
              <select value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value)} className="field">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <p className="flex gap-4">
              <a href={`mailto:${e.email}`} className="underline">{e.email}</a>
              {e.phone && <a href={`tel:${e.phone}`} className="underline">{e.phone}</a>}
            </p>
            <p className="whitespace-pre-wrap rounded-xl bg-glass p-3">{e.message}</p>
            <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
          </div>
        ))}
        {data?.length === 0 && <p className="text-muted-foreground">No enquiries yet.</p>}
      </div>
    </div>
  );
}
