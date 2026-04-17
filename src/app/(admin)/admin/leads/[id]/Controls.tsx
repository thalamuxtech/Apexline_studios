"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus, addLeadNote, deleteLead } from "@/app/actions/adminLeads";
import { Trash2 } from "lucide-react";

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "archived"] as const;
type Status = typeof STATUSES[number];

export function StatusControls({ id, status }: { id: string; status: Status }) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState<Status>(status);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-stone mr-2">Status</span>
      {STATUSES.map((s) => (
        <button
          key={s}
          disabled={pending}
          onClick={() => {
            setCurrent(s);
            start(async () => { await updateLeadStatus(id, s); });
          }}
          className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors ${
            current === s ? "bg-onyx text-bone border-onyx" : "bg-white text-onyx border-onyx/20 hover:border-onyx"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!note.trim()) return;
        start(async () => {
          await addLeadNote(id, note);
          setNote("");
        });
      }}
      className="space-y-3"
    >
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Add an internal note..."
        className="w-full border border-onyx/15 bg-bone p-3 text-sm outline-none focus:border-gold resize-y"
      />
      <button type="submit" disabled={pending || !note.trim()} className="btn-ghost-dark">
        {pending ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}

export function DeleteControl({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="pt-4 border-t border-onyx/10">
      <button
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-danger hover:underline"
        onClick={() => {
          if (!confirm("Delete this submission permanently?")) return;
          start(async () => {
            await deleteLead(id);
            router.push("/admin/leads");
          });
        }}
        disabled={pending}
      >
        <Trash2 className="h-4 w-4" /> {pending ? "Deleting..." : "Delete submission"}
      </button>
    </div>
  );
}
