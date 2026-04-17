"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { Input, Label, Textarea, Consent } from "./Field";

export function ContactForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (values: ContactInput) => {
    setErrMsg(null);
    start(async () => {
      const res = await submitLead("contact", values);
      if (res.ok) { setOk(true); reset(); }
      else setErrMsg(res.error);
    });
  };

  if (ok) return <SuccessState title="Message received." body="Thank you — our team will respond within one business day." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid md:grid-cols-2 gap-7">
        <div>
          <Label htmlFor="name" required>Your name</Label>
          <Input id="name" {...register("name")} error={errors.name?.message} placeholder="Full name" />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" {...register("email")} error={errors.email?.message} placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} error={errors.phone?.message} placeholder="+234 ..." />
        </div>
        <div>
          <Label htmlFor="subject" required>Subject</Label>
          <Input id="subject" {...register("subject")} error={errors.subject?.message} placeholder="Project enquiry" />
        </div>
      </div>
      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" {...register("message")} error={errors.message?.message} placeholder="Tell us briefly what you have in mind..." />
      </div>
      <Consent register={register("consent")} error={errors.consent?.message} />
      {errMsg && <p className="text-sm text-danger">{errMsg}</p>}
      <button type="submit" disabled={pending} className="btn-ghost-dark group">
        {pending ? "Sending..." : "Send message"}
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

export function SuccessState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-gold/40 bg-gold/5 p-8 md:p-10 flex items-start gap-5">
      <CheckCircle2 className="h-8 w-8 text-gold shrink-0" strokeWidth={1.25} />
      <div>
        <p className="font-display text-2xl md:text-3xl text-onyx">{title}</p>
        <p className="mt-2 text-stone leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
