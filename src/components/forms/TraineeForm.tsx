"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import { traineeSchema, type TraineeInput } from "@/lib/schemas";
import { Input, Label, Textarea, Select, Consent } from "./Field";
import { SuccessState } from "./ContactForm";

export function TraineeForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TraineeInput>({ resolver: zodResolver(traineeSchema) });

  const onSubmit = (values: TraineeInput) => {
    setErrMsg(null);
    start(async () => {
      const res = await submitLead("trainee", values);
      if (res.ok) { setOk(true); reset(); }
      else setErrMsg(res.error);
    });
  };

  if (ok) return <SuccessState title="Application received." body="We&rsquo;ll review your training application and come back to you with next steps and available cohorts." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div><Label required>Full name</Label><Input {...register("fullName")} error={errors.fullName?.message} /></div>
        <div><Label required>Email</Label><Input type="email" {...register("email")} error={errors.email?.message} /></div>
        <div><Label required>Phone</Label><Input {...register("phone")} error={errors.phone?.message} /></div>
        <div><Label required>School / Institution</Label><Input {...register("school")} error={errors.school?.message} /></div>
        <div><Label required>Course of study</Label><Input {...register("course")} error={errors.course?.message} /></div>
        <div>
          <Label required>Current level</Label>
          <Select {...register("level")} error={errors.level?.message} options={[
            { value: "", label: "Select level..." },
            { value: "100", label: "100 Level" },
            { value: "200", label: "200 Level" },
            { value: "300", label: "300 Level" },
            { value: "400", label: "400 Level" },
            { value: "500", label: "500 Level" },
            { value: "postgrad", label: "Postgraduate" },
            { value: "siwes", label: "SIWES / IT" },
            { value: "nysc", label: "NYSC" },
            { value: "completed", label: "Graduated" },
          ]} />
        </div>
        <div>
          <Label required>Preferred duration</Label>
          <Select {...register("duration")} error={errors.duration?.message} options={[
            { value: "", label: "Select duration..." },
            { value: "1-month", label: "1 month" },
            { value: "3-months", label: "3 months" },
            { value: "6-months", label: "6 months" },
            { value: "12-months", label: "12 months" },
          ]} />
        </div>
        <div>
          <Label required>Area of interest</Label>
          <Select {...register("interest")} error={errors.interest?.message} options={[
            { value: "", label: "Select an area..." },
            { value: "architecture", label: "Architecture" },
            { value: "construction", label: "Construction" },
            { value: "interior", label: "Interior Design" },
            { value: "exterior", label: "Exterior / Landscape" },
            { value: "project-management", label: "Project Management" },
            { value: "draughting", label: "Draughting / BIM" },
            { value: "all", label: "All — rotational" },
          ]} />
        </div>
        <div className="md:col-span-2"><Label>Portfolio URL (optional)</Label><Input {...register("portfolioUrl")} error={errors.portfolioUrl?.message} placeholder="https://..." /></div>
        <div className="md:col-span-2">
          <Label required>Your motivation</Label>
          <Textarea rows={4} {...register("motivation")} error={errors.motivation?.message} placeholder="What do you hope to learn at Apex-Line?" />
        </div>
      </div>

      <Consent register={register("consent")} error={errors.consent?.message} />
      {errMsg && <p className="text-sm text-danger">{errMsg}</p>}

      <button type="submit" disabled={pending} className="btn-primary group">
        {pending ? "Submitting..." : "Submit training application"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
