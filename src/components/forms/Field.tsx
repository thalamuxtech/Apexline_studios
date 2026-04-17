"use client";
import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";

export function Label({ htmlFor, children, required }: { htmlFor?: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium text-onyx/80">
      <span>{children}</span>
      {required && <span className="text-gold">*</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => (
    <div>
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent border-b border-onyx/25 px-0 py-3 text-base text-onyx placeholder:text-onyx/40 outline-none transition-colors focus:border-gold focus-visible:border-gold",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => (
    <div>
      <textarea
        ref={ref}
        rows={4}
        className={cn(
          "w-full bg-transparent border-b border-onyx/25 px-0 py-3 text-base text-onyx placeholder:text-onyx/40 outline-none transition-colors focus:border-gold focus-visible:border-gold resize-y",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { error?: string; options: { value: string; label: string }[] }>(
  ({ className, error, options, ...props }, ref) => (
    <div>
      <select
        ref={ref}
        className={cn(
          "w-full bg-transparent border-b border-onyx/25 px-0 py-3 text-base text-onyx outline-none focus:border-gold appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path fill=%22none%22 stroke=%22%230B0B0C%22 stroke-width=%221.5%22 d=%22M1 1l5 5 5-5%22/></svg>')] bg-[length:12px_8px] bg-no-repeat bg-[right_0.5rem_center] pr-8",
          error && "border-danger",
          className,
        )}
        {...props}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";

export function Consent({ register, error }: { register: any; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-stone leading-relaxed cursor-pointer select-none">
        <input type="checkbox" {...register} className="mt-1 h-4 w-4 accent-gold" />
        <span>
          I agree to Apex-Line Studios processing my details for this enquiry and contacting me about my request, in line with the <a className="text-onyx underline underline-offset-4" href="/privacy">privacy notice</a>.
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
