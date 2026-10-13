import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { attachCandidateCv } from "@/lib/candidates.functions";
import { toast } from "sonner";

export function CandidateCvUpload({ id, hasCv }: { id: string; hasCv: boolean }) {
  const attach = useServerFn(attachCandidateCv);
  const qc = useQueryClient();
  const upload = useMutation({ mutationFn: (file: File) => {
    const form = new FormData(); form.set("id", id); form.set("cv", file); return attach({ data: form });
  }, onSuccess: () => {
    for (const key of ["candidate", "candidates", "job-applicants"]) qc.invalidateQueries({ queryKey: [key] });
    toast.success("CV attached");
  }, onError: (err) => toast.error(err.message) });
  return <label className="block text-sm font-semibold">{upload.isPending ? "Uploading CV…" : hasCv ? "Replace CV" : "Upload CV"}<input aria-label="Upload candidate CV" type="file" accept=".pdf,.doc,.docx" disabled={upload.isPending} className="mt-2 block w-full min-w-0 text-xs font-normal" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload.mutate(file); e.target.value = ""; }} /><span className="mt-1 block text-xs font-normal text-muted-foreground">PDF or Word · up to 8 MB</span></label>;
}