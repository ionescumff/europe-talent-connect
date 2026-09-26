import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitEmployerMessage } from "@/lib/submissions.functions";

export function EmployerMessageForm() {
  const send = useServerFn(submitEmployerMessage);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await send({
        data: {
          name: String(f.get("name") ?? ""), company: String(f.get("company") ?? ""),
          email: String(f.get("email") ?? ""), phone: String(f.get("phone") ?? ""),
          subject: String(f.get("subject") ?? ""), body: String(f.get("body") ?? ""),
          privacyAccepted: f.get("privacy") === "on",
        },
      });
      setSent(true);
    } catch {
      toast.error("We couldn't send your message. Please check the fields and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-bold">Message sent</h3>
        <p className="mt-1 text-sm text-muted-foreground">Our co-founders have received it and will reply by email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-card grid gap-3 p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h3 className="font-display text-lg font-bold">Message the co-founders</h3>
        <p className="text-sm text-muted-foreground">For employers: your message goes straight to our co-founders and admins.</p>
      </div>
      <input name="name" required minLength={2} placeholder="Your name" className="field" />
      <input name="company" required minLength={2} placeholder="Company" className="field" />
      <input name="email" type="email" required placeholder="Work email" className="field" />
      <input name="phone" placeholder="Phone (optional)" className="field" />
      <input name="subject" required minLength={2} placeholder="Subject" className="field sm:col-span-2" />
      <textarea name="body" required minLength={5} rows={5} placeholder="Your message" className="field sm:col-span-2" />
      <label className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
        <input type="checkbox" name="privacy" required className="mt-0.5" />
        <span>I have read the <Link to="/privacy" className="underline">privacy notice</Link>.</span>
      </label>
      <button disabled={busy} className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground disabled:opacity-60 sm:col-span-2">
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
