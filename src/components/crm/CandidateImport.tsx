import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as XLSX from "xlsx";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { candidateFields, candidateFieldLabels, candidateImportSchema, normalizedPhone } from "@/lib/candidate-import";
import { importCandidates } from "@/lib/candidates.functions";

const aliases: Record<string, string[]> = {
  full_name: ["fullname", "name", "candidatename", "nume", "numecomplet"], phone: ["phone", "telephone", "mobile", "telefon"],
  email: ["email", "emailaddress"], sector: ["sector", "industry", "domeniu"], country_preference: ["country", "countrypreference", "tara"],
  message: ["message", "notes", "note", "observatii"], applied_job: ["appliedjob", "job", "jobslug", "jobid", "vacancy"],
};
const headerKey = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");

export function CandidateImport({ jobId }: { jobId?: string }) {
  const runImport = useServerFn(importCandidates);
  const qc = useQueryClient();
  const [sheets, setSheets] = useState<Record<string, string[][]>>({});
  const [sheet, setSheet] = useState("");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [result, setResult] = useState<{ imported: number; rejected: { row: number; reason: string }[] } | null>(null);
  const existing = useQuery({ queryKey: ["candidate-import-identities"], queryFn: async () => {
    const all: { phone: string; email: string | null }[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.from("cv_submissions").select("phone, email").order("id").range(offset, offset + 999);
      if (error) throw error;
      all.push(...data); if (data.length < 1000) return all;
    }
  } });
  const rows = sheets[sheet] ?? [];
  const headers = rows[0] ?? [];
  const preview = useMemo(() => {
    const phones = new Set(existing.data?.map((c) => normalizedPhone(c.phone)));
    const emails = new Set(existing.data?.flatMap((c) => c.email ? [c.email.toLowerCase()] : []));
    return rows.slice(1).filter((r) => r.some((v) => v.trim())).map((r, index) => {
      const value = (key: string) => mapping[key] === undefined || mapping[key] === "" ? "" : (r[Number(mapping[key])] ?? "").trim();
      const rawCountry = value("country_preference").toLowerCase();
      const country = ["nl", "netherlands", "olanda"].includes(rawCountry) ? "netherlands" : ["de", "germany", "germania"].includes(rawCountry) ? "germany" : ["", "both", "ambele"].includes(rawCountry) ? "both" : rawCountry;
      const parsed = candidateImportSchema.safeParse({ ...Object.fromEntries(candidateFields.map((f) => [f, value(f)])), country_preference: country });
      if (!parsed.success) return { number: index + 2, name: value("full_name"), data: null, issue: parsed.error.issues.map((i) => `${candidateFieldLabels[i.path[0] as keyof typeof candidateFieldLabels] ?? i.path[0]}: ${i.message}`).join("; ") };
      const p = normalizedPhone(parsed.data.phone), e = parsed.data.email.toLowerCase();
      const duplicate = phones.has(p) || (e && emails.has(e));
      phones.add(p); if (e) emails.add(e);
      return { number: index + 2, name: parsed.data.full_name, data: parsed.data, issue: p.length < 6 ? "Invalid phone number" : duplicate ? "Duplicate phone or email — skipped" : "" };
    });
  }, [rows, mapping, existing.data]);
  const valid = preview.flatMap((r) => r.data && !r.issue ? [r.data] : []);
  const save = useMutation({ mutationFn: () => runImport({ data: { rows: valid, jobId, authorized: true } }), onSuccess: (response) => {
    setResult(response); setSheets({}); setSheet(""); setAuthorized(false);
    for (const key of ["candidates", "candidates-lite", "candidate-import-identities", "job-applicants", "job-links", "admin-overview"]) qc.invalidateQueries({ queryKey: [key] });
  } });
  function chooseSheet(name: string, workbook = sheets) {
    setSheet(name); const first = workbook[name]?.[0] ?? [];
    setMapping(Object.fromEntries(candidateFields.map((f) => [f, String(first.findIndex((h) => aliases[f]?.includes(headerKey(h)))).replace("-1", "")])));
  }
  async function read(file?: File) {
    if (!file) return;
    setError(""); setResult(null); save.reset();
    try {
      if (!/\.(xlsx|xls|csv)$/i.test(file.name) || file.size > 10 * 1024 * 1024) throw new Error("Choose an Excel or CSV file under 10 MB");
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const next: Record<string, string[][]> = {};
      for (const name of wb.SheetNames) {
        const ws = wb.Sheets[name]; if (ws) next[name] = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "", raw: false });
      }
      setSheets(next); const first = wb.SheetNames[0]; if (first) chooseSheet(first, next);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not read this spreadsheet"); }
  }
  function downloadTemplate() {
    const blob = new Blob([candidateFields.join(",") + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = "candidate-import-template.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return <section className="space-y-4 border-y border-glass-border py-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-bold">Import candidates</h2><Button variant="outline" onClick={downloadTemplate}><Download /> CSV template</Button></div>
    <label className="flex cursor-pointer items-center gap-3 border border-dashed border-glass-border p-4 text-sm"><Upload className="size-5 shrink-0" /><span>Upload Excel / CSV</span><input aria-label="Candidate spreadsheet" type="file" className="min-w-0 flex-1 text-xs" accept=".xlsx,.xls,.csv" onChange={(e) => { read(e.target.files?.[0]); e.target.value = ""; }} /></label>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {sheet && <>
      <label className="block text-sm">Worksheet<select aria-label="Worksheet" className="field ml-2 max-w-full" value={sheet} onChange={(e) => chooseSheet(e.target.value)}>{Object.keys(sheets).map((s) => <option key={s}>{s}</option>)}</select></label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{candidateFields.map((f) => <label key={f} className="text-xs font-semibold">{candidateFieldLabels[f]}<select aria-label={candidateFieldLabels[f]} className="field mt-1 w-full" value={mapping[f] ?? ""} onChange={(e) => setMapping({ ...mapping, [f]: e.target.value })}><option value="">{f === "country_preference" ? "Both countries" : "Not mapped"}</option>{headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}</select></label>)}</div>
      {existing.error && <p role="alert" className="text-destructive">Could not check duplicates. Import is disabled.</p>}
      <p className="text-sm text-muted-foreground">{valid.length} ready · {preview.length - valid.length} skipped</p>
      <div className="max-h-72 overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Row</th><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Review</th></tr></thead><tbody>{preview.map((r) => <tr key={r.number} className="border-t border-glass-border"><td className="p-2">{r.number}</td><td className="p-2">{r.name || "—"}</td><td className="p-2">{r.data?.phone ?? "—"}</td><td className={`p-2 ${r.issue ? "text-destructive" : "text-muted-foreground"}`}>{r.issue || "Ready"}</td></tr>)}</tbody></table></div>
      {valid.length > 300 && <p className="text-destructive">Import a maximum of 300 candidates at a time.</p>}
      <label className="flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} />I am authorized to store and process these candidates’ information.</label>
      <div className="flex gap-2"><Button disabled={!authorized || !valid.length || valid.length > 300 || save.isPending || !existing.isSuccess} onClick={() => save.mutate()}>{save.isPending ? "Importing…" : `Import ${valid.length} candidates`}</Button><Button variant="ghost" onClick={() => { setSheets({}); setSheet(""); }}>Cancel</Button></div>
    </>}
    {save.error && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}
    {result && <div role="status" className="text-sm"><p>{result.imported} candidates imported. {result.rejected.length} skipped.</p>{result.rejected.map((r) => <p key={r.row}>Import row {r.row}: {r.reason}</p>)}</div>}
  </section>;
}