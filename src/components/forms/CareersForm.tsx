"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { careersSchema, type CareersInput } from "@/lib/schemas";
import { Input, Label, Textarea, Select, Consent } from "./Field";
import { SuccessState } from "./ContactForm";

export function CareersForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CareersInput>({ resolver: zodResolver(careersSchema) });

  const onSubmit = (values: CareersInput) => {
    setErrMsg(null);
    start(async () => {
      const res = await submitLead("careers", values);
      if (res.ok) { setOk(true); reset(); }
      else setErrMsg(res.error);
    });
  };

  if (ok) return <SuccessState title="Application received." body="We review every application personally. If there&rsquo;s a fit you&rsquo;ll hear from us within two weeks." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div><Label required>Full name</Label><Input {...register("fullName")} error={errors.fullName?.message} /></div>
        <div><Label required>Email</Label><Input type="email" {...register("email")} error={errors.email?.message} /></div>
        <div><Label required>Phone</Label><Input {...register("phone")} error={errors.phone?.message} /></div>
        <div><Label required>Location</Label><Input {...register("location")} error={errors.location?.message} placeholder="City, State" /></div>
        <div>
          <Label required>Role applied for</Label>
          <Select {...register("role")} error={errors.role?.message} options={[
            { value: "", label: "Select a role..." },
            { value: "architect", label: "Architect" },
            { value: "site-engineer", label: "Site Engineer" },
            { value: "foreman", label: "Foreman / Site Supervisor" },
            { value: "interior-designer", label: "Interior Designer" },
            { value: "draughtsperson", label: "Draughtsperson" },
            { value: "project-manager", label: "Project Manager" },
            { value: "quantity-surveyor", label: "Quantity Surveyor" },
            { value: "admin", label: "Admin / Operations" },
            { value: "other", label: "Other" },
          ]} />
        </div>
        <div><Label required>Years of experience</Label><Input type="number" min={0} max={50} {...register("experienceYears")} error={errors.experienceYears?.message} /></div>
        <div className="md:col-span-2"><Label>Portfolio / LinkedIn URL</Label><Input {...register("portfolioUrl")} error={errors.portfolioUrl?.message} placeholder="https://..." /></div>
        <div className="md:col-span-2">
          <Label required>Why Apex-Line?</Label>
          <Textarea rows={5} {...register("coverLetter")} error={errors.coverLetter?.message} placeholder="Tell us a bit about yourself and what you'd like to build with us..." />
        </div>
      </div>

      <Consent register={register("consent")} error={errors.consent?.message} />
      {errMsg && <p className="text-sm text-danger">{errMsg}</p>}

      <button type="submit" disabled={pending} className="btn-primary group">
        {pending ? "Submitting..." : "Submit application"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
