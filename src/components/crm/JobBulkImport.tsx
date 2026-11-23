import { Fragment, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Download, Upload, FileSpreadsheet, Check, Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { JOB_COLUMNS, matchJobColumns, mapJobRow, reviewBulkJobs, type BulkJob, type JobColumn, type JobIdentity } from "@/lib/job-bulk";
import { importBulkJobs } from "@/lib/job-bulk.functions";
import excelTemplate from "@/assets/ionman-job-template.xlsx.asset.json";
import csvTemplate from "@/assets/ionman-job-template.csv.asset.json";

type ReviewRow = { job: BulkJob; selected: boolean; sourceRow: number };
const required = new Set<JobColumn>(["title", "sector", "city", "country", "salary"]);
const tableFields: JobColumn[] = ["title", "company_name", "sector", "city", "country", "salary"];

export function JobBulkImport({ existing, onImported, ready }: { existing: JobIdentity[]; onImported: () => void; ready: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const upload = useServerFn(importBulkJobs);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<JobColumn, number>>(() => matchJobColumns([]));
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState("");
  const issues = useMemo(() => reviewBulkJobs(rows.map(r => r.job), existing), [rows, existing]);
  const selected = rows.filter(r => r.selected);
  const selectedInvalid = rows.some((r, i) => r.selected && (issues[i]?.length ?? 0) > 0);
  const busy = reading;
  const save = useMutation({
    mutationFn: (published: boolean) => upload({ data: { jobs: selected.map(r => r.job), published } }),
    onSuccess: data => {
      setResult(`${data.count} jobs ${data.published ? "published on the Jobs page" : "saved as drafts — not visible on the website"}.`);
      setRows(current => current.filter(row => !row.selected)); setConfirmed(false); onImported();
    },
  });

  async function readFile(file: File) {
    setError(""); setResult(""); save.reset();
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) { setError("Choose an Excel or CSV file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("The file must be smaller than 10 MB."); return; }
    setReading(true);
    try {
      const book = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false, sheetRows: 502 });
      const name = book.SheetNames.find(n => n.toLowerCase() === "jobs") ?? book.SheetNames[0];
      const sheet = name ? book.Sheets[name] : undefined;
      if (!sheet) throw new Error("No worksheet was found.");
      const values = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: "", raw: false, blankrows: true });
      const first = values.findIndex(row => row.some(cell => String(cell).trim()));
      const head = values[first]?.map(String) ?? [];
      const source = values.slice(first + 1).map(row => row.map(String));
      const nonempty = source.filter(row => row.some(cell => cell.trim()));
      const usedRange = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
      if (nonempty.length > 500 || usedRange.e.r > 500) throw new Error("Maximum 500 job rows per batch. Split larger sheets into separate files.");
      if (!head.length || !nonempty.length) throw new Error("The sheet needs a header row and at least one job row.");
      setHeaders(head); setRawRows(source); setMapping(matchJobColumns(head)); setRows([]); setFileName(file.name); setConfirmed(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The file could not be read."); }
    finally { setReading(false); }
  }

  function prepare() {
    const next = rawRows.map((row, i) => ({ job: mapJobRow(row, mapping), sourceRow: i + 2, selected: false })).filter(row => Object.values(row.job).some(Boolean));
    const checked = reviewBulkJobs(next.map(row => row.job), existing);
    setRows(next.map((row, i) => ({ ...row, selected: !checked[i]?.length })));
    setConfirmed(false); save.reset(); setResult("");
    if (!next.length) setError("No job values were found in the selected columns."); else setError("");
  }
  function edit(index: number, key: JobColumn, value: string) {
    setRows(current => current.map((row, i) => i === index ? { ...row, job: { ...row.job, [key]: value } } : row));
    setConfirmed(false); save.reset();
  }
  const locked = busy || save.isPending;
  const canSave = ready && selected.length > 0 && !selectedInvalid && !locked;
  const fieldClass = "field min-w-0 w-full rounded-md px-3 py-2 text-sm";

  return <section className="space-y-5 border-y border-glass-border py-6" aria-labelledby="bulk-job-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="bulk-job-title" className="flex items-center gap-2 font-display text-lg font-bold"><FileSpreadsheet className="size-5" />Bulk job upload</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild><a href={excelTemplate.url} download="ionman-job-template.xlsx"><Download />Excel template</a></Button>
        <Button variant="outline" asChild><a href={csvTemplate.url} download="ionman-job-template.csv"><Download />CSV template</a></Button>
      </div>
    </div>
    <div onDragOver={e => { e.preventDefault(); if (!locked) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file && !locked) void readFile(file); }}
      className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-6 text-center ${dragging ? "border-accent bg-glass" : "border-glass-border"}`}>
      <Upload className="size-7 text-muted-foreground" />
      <span className="text-sm font-semibold">{reading ? "Reading spreadsheet…" : "Drop an Excel or CSV file"}</span>
      <span className="text-xs text-muted-foreground">XLSX, XLS, CSV · up to 500 jobs · 10 MB</span>
      <Button variant="outline" disabled={locked} onClick={() => input.current?.click()}>{reading ? <Loader2 className="animate-spin" /> : <Upload />}Choose file</Button>
      <input ref={input} type="file" accept=".xlsx,.xls,.csv" aria-label="Upload job spreadsheet" className="sr-only" disabled={locked} onChange={e => { const file = e.target.files?.[0]; if (file) void readFile(file); e.target.value = ""; }} />
    </div>
    {error && <p role="alert" className="whitespace-pre-line text-sm text-destructive">{error}</p>}
    {result && <p role="status" className="flex items-center gap-2 text-sm"><Check className="size-4 text-accent" />{result}</p>}
    {headers.length > 0 && <details open={!rows.length} className="space-y-4">
      <summary className="cursor-pointer text-sm font-semibold">Column mapping — {fileName}</summary>
      <fieldset disabled={locked} className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {JOB_COLUMNS.map(([key, label]) => <label key={key} className="min-w-0 text-xs font-semibold text-muted-foreground">{label}{required.has(key) ? " *" : ""}
          <select aria-label={`Map ${label}`} className={`${fieldClass} mt-1`} value={mapping[key]} onChange={e => setMapping(current => ({ ...current, [key]: Number(e.target.value) }))}>
            <option value={-1}>Not included</option>{headers.map((header, i) => <option key={i} value={i}>{header || `Column ${i + 1}`}</option>)}
          </select>
        </label>)}
      </fieldset>
      <Button variant="outline" className="mt-4" disabled={locked || !ready || [...required].some(key => mapping[key] < 0)} onClick={prepare}>Review rows</Button>
    </details>}
    {rows.length > 0 && <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Review {rows.length} jobs · {selected.length} selected · {issues.filter(v => v.length).length} need attention</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={locked} onClick={() => setRows(current => current.map((row, i) => ({ ...row, selected: !issues[i]?.length })))}>Select valid rows</Button>
          <Button variant="ghost" disabled={locked} onClick={() => setRows(current => current.map(row => ({ ...row, selected: false })))}>Deselect all</Button>
          <Button variant="ghost" disabled={locked} onClick={() => { setRows([]); setHeaders([]); setRawRows([]); setConfirmed(false); }}><X />Clear</Button>
        </div>
      </div>
      <div className="max-h-[36rem] overflow-auto border border-glass-border rounded-md">
        <table className="w-full min-w-[1120px] text-sm">
          <thead className="sticky top-0 z-10 bg-background text-left text-xs text-muted-foreground"><tr><th className="p-3">Select</th><th className="p-3">Row</th>{tableFields.map(key => <th className="p-3" key={key}>{JOB_COLUMNS.find(c => c[0] === key)?.[1]}</th>)}<th className="p-3">Details</th></tr></thead>
          <tbody>{rows.map((row, index) => <Fragment key={row.sourceRow}>
            <tr className="border-t border-glass-border align-top">
              <td className="p-3"><input type="checkbox" aria-label={`Select job row ${row.sourceRow}`} disabled={locked || !!issues[index]?.length} checked={row.selected} onChange={e => setRows(current => current.map((r, i) => i === index ? { ...r, selected: e.target.checked } : r))} /></td>
              <td className="p-3 text-muted-foreground">{row.sourceRow}</td>
              {tableFields.map(key => <td key={key} className="p-2"><input disabled={locked} aria-label={`${key} row ${row.sourceRow}`} className={`${fieldClass} min-w-32`} value={row.job[key]} onChange={e => edit(index, key, e.target.value)} /></td>)}
              <td className="p-2"><details><summary className="cursor-pointer py-2 font-semibold">Edit details</summary><fieldset disabled={locked} className="grid w-80 gap-3 p-2">
                {JOB_COLUMNS.filter(([key]) => !tableFields.includes(key)).map(([key, label]) => <label key={key} className="text-xs font-semibold text-muted-foreground">{label}<textarea aria-label={`${key} row ${row.sourceRow}`} className={`${fieldClass} mt-1`} rows={2} value={row.job[key]} onChange={e => edit(index, key, e.target.value)} /></label>)}
              </fieldset></details></td>
            </tr>
            {!!issues[index]?.length && <tr><td colSpan={9} className="px-4 pb-3 text-xs text-destructive">Row {row.sourceRow}: {issues[index]?.join(" · ")}</td></tr>}
          </Fragment>)}</tbody>
        </table>
      </div>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={confirmed} disabled={locked} onChange={e => setConfirmed(e.target.checked)} /><span>I confirm the selected jobs and their terms are employer-approved for publication.</span></label>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={!canSave} onClick={() => save.mutate(false)}>{save.isPending && <Loader2 className="animate-spin" />}Save {selected.length} as drafts</Button>
        <Button disabled={!canSave || !confirmed} onClick={() => save.mutate(true)}>{save.isPending && <Loader2 className="animate-spin" />}Publish {selected.length} jobs</Button>
      </div>
      {save.error && <p role="alert" className="whitespace-pre-line text-sm text-destructive">{save.error.message}</p>}
    </>}
  </section>;
}