import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { alertSectors, sectorLabelsRo } from "@/lib/job-alerts";
import { getJobAlert, saveJobAlert } from "@/lib/job-alerts.functions";

export function JobAlertForm({ userId }: { userId: string }) {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const fetchAlert = useServerFn(getJobAlert); const saveAlert = useServerFn(saveJobAlert);
  const alert = useQuery({ queryKey: ["job-alert", userId], queryFn: () => fetchAlert() });
  const save = useMutation({
    mutationFn: (data: Parameters<typeof saveAlert>[0]["data"]) => saveAlert({ data }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["job-alert"] }); toast.success(t("Job alert saved", "Alerta a fost salvată")); },
    onError: () => toast.error(t("Couldn't save your alert. Try again.", "Alerta nu a putut fi salvată. Încearcă din nou.")),
  });
  const a = alert.data;
  return <section className="border-t border-border pt-8">
    <div className="flex items-center gap-3"><Bell className="size-5" /><h2 className="font-display text-xl font-bold">{t("Job alerts", "Alerte de joburi")}</h2></div>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Get an email when new Triangle jobs matching your choices are posted. Leave all sectors unticked to get every new job.", "Primești un email când apar joburi noi Triangle potrivite pentru tine. Dacă nu bifezi niciun domeniu, primești toate joburile noi.")}</p>
    {alert.isPending && <p role="status" className="mt-4 text-sm">{t("Loading…", "Se încarcă…")}</p>}
    {alert.isError && <p role="alert" className="mt-4 text-sm">{t("Couldn't load your alert.", "Alerta nu a putut fi încărcată.")}</p>}
    {alert.isSuccess && <form key={JSON.stringify(a)} className="mt-5 space-y-4" onSubmit={e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      save.mutate({ sectors: f.getAll("sectors").map(String) as never, city: String(f.get("city") ?? "").trim() || null, lang: f.get("lang") === "en" ? "en" : "ro", active: f.get("active") === "on" });
    }}>
      <fieldset><legend className="text-sm">{t("Sectors", "Domenii")}</legend><div className="mt-2 grid grid-cols-2 gap-2">
        {alertSectors.map(s => <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" name="sectors" value={s} defaultChecked={a?.sectors.includes(s)} className="size-4" />{lang === "ro" ? sectorLabelsRo[s] : s}</label>)}
      </div></fieldset>
      <label className="block text-sm">{t("City (optional)", "Oraș (opțional)")}<input name="city" maxLength={80} defaultValue={a?.city ?? ""} placeholder="Utrecht" className="field mt-2 w-full" /></label>
      <label className="block text-sm">{t("Email language", "Limba emailului")}<select name="lang" defaultValue={a?.lang ?? lang} className="field mt-2 w-full"><option value="ro">Română</option><option value="en">English</option></select></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={a ? a.active : true} className="size-4" />{t("Send me job alerts", "Trimite-mi alerte de joburi")}</label>
      <Button type="submit" variant="outline" disabled={save.isPending}>{save.isPending ? t("Saving…", "Se salvează…") : t("Save alert", "Salvează alerta")}</Button>
    </form>}
  </section>;
}
