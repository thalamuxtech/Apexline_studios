"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { quoteSchema, type QuoteInput } from "@/lib/schemas";
import { Input, Label, Textarea, Select, Consent } from "./Field";
import { SuccessState } from "./ContactForm";

export function QuoteForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteInput>({ resolver: zodResolver(quoteSchema) });

  const onSubmit = (values: QuoteInput) => {
    setErrMsg(null);
    start(async () => {
      const res = await submitLead("quote", values);
      if (res.ok) { setOk(true); reset(); }
      else setErrMsg(res.error);
    });
  };

  if (ok) return <SuccessState title="Brief received." body="A principal will review your request and reach out within two business days to schedule an initial call." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <section>
        <p className="eyebrow mb-5">Step 01 — About you</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div><Label required>Full name</Label><Input {...register("fullName")} error={errors.fullName?.message} placeholder="Your full name" /></div>
          <div><Label required>Email</Label><Input type="email" {...register("email")} error={errors.email?.message} placeholder="you@company.com" /></div>
          <div><Label required>Phone</Label><Input {...register("phone")} error={errors.phone?.message} placeholder="+234 ..." /></div>
          <div><Label>Company (optional)</Label><Input {...register("company")} error={errors.company?.message} placeholder="Company or organisation" /></div>
        </div>
      </section>

      <section>
        <p className="eyebrow mb-5">Step 02 — Your project</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label required>Service needed</Label>
            <Select {...register("serviceType")} error={errors.serviceType?.message} options={[
              { value: "", label: "Select a service..." },
              { value: "architectural-design", label: "Architectural Design" },
              { value: "construction-management", label: "Construction Management" },
              { value: "interior-design", label: "Interior Design" },
              { value: "exterior-landscape", label: "Exterior & Landscape" },
              { value: "renovation-remodelling", label: "Renovation & Remodelling" },
              { value: "project-consultancy", label: "Project Consultancy" },
            ]} />
          </div>
          <div>
            <Label required>Project type</Label>
            <Select {...register("projectType")} error={errors.projectType?.message} options={[
              { value: "", label: "Select project type..." },
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
              { value: "hospitality", label: "Hospitality" },
              { value: "healthcare", label: "Healthcare" },
              { value: "industrial", label: "Industrial" },
              { value: "institutional", label: "Institutional" },
              { value: "other", label: "Other" },
            ]} />
          </div>
          <div>
            <Label required>Indicative budget (NGN)</Label>
            <Select {...register("budget")} error={errors.budget?.message} options={[
              { value: "", label: "Select budget range..." },
              { value: "under-10m", label: "Under ₦10M" },
              { value: "10m-50m", label: "₦10M – ₦50M" },
              { value: "50m-200m", label: "₦50M – ₦200M" },
              { value: "200m-500m", label: "₦200M – ₦500M" },
              { value: "500m-plus", label: "₦500M+" },
              { value: "undecided", label: "Not yet determined" },
            ]} />
          </div>
          <div>
            <Label required>Timeline</Label>
            <Select {...register("timeline")} error={errors.timeline?.message} options={[
              { value: "", label: "Select timeline..." },
              { value: "immediately", label: "Ready to start" },
              { value: "1-3-months", label: "1 – 3 months" },
              { value: "3-6-months", label: "3 – 6 months" },
              { value: "6-12-months", label: "6 – 12 months" },
              { value: "exploring", label: "Still exploring" },
            ]} />
          </div>
          <div className="md:col-span-2">
            <Label required>Project location</Label>
            <Input {...register("location")} error={errors.location?.message} placeholder="City / area / state" />
          </div>
          <div className="md:col-span-2">
            <Label required>Brief description</Label>
            <Textarea rows={5} {...register("description")} error={errors.description?.message} placeholder="Site context, scope, and any goals we should know about..." />
          </div>
          <div className="md:col-span-2">
            <Label>How did you hear about us?</Label>
            <Input {...register("referral")} placeholder="Referral, search, publication..." />
          </div>
        </div>
      </section>

      <Consent register={register("consent")} error={errors.consent?.message} />
      {errMsg && <p className="text-sm text-danger">{errMsg}</p>}

      <button type="submit" disabled={pending} className="btn-primary group text-onyx">
        {pending ? "Submitting..." : "Submit project brief"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
