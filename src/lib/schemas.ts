import { z } from "zod";

export const phoneRegex = /^[+\d][\d\s\-()]{6,}$/;

export const contactSchema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message should be at least 10 characters"),
  consent: z.literal(true, { errorMap: () => ({ message: "You must accept the privacy notice" }) }),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  company: z.string().optional().or(z.literal("")),
  serviceType: z.enum(["architectural-design", "construction-management", "interior-design", "exterior-landscape", "renovation-remodelling", "project-consultancy"]),
  projectType: z.enum(["residential", "commercial", "hospitality", "healthcare", "industrial", "institutional", "other"]),
  budget: z.enum(["under-10m", "10m-50m", "50m-200m", "200m-500m", "500m-plus", "undecided"]),
  timeline: z.enum(["immediately", "1-3-months", "3-6-months", "6-12-months", "exploring"]),
  location: z.string().min(2),
  description: z.string().min(20, "Please describe your project in at least 20 characters"),
  referral: z.string().optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const careersSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  role: z.enum(["architect", "site-engineer", "foreman", "interior-designer", "draughtsperson", "project-manager", "quantity-surveyor", "admin", "other"]),
  experienceYears: z.coerce.number().min(0).max(50),
  location: z.string().min(2),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().min(20, "Tell us a little about yourself (20+ chars)"),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});
export type CareersInput = z.infer<typeof careersSchema>;

export const traineeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  school: z.string().min(2),
  course: z.string().min(2),
  level: z.enum(["100", "200", "300", "400", "500", "postgrad", "siwes", "nysc", "completed"]),
  duration: z.enum(["1-month", "3-months", "6-months", "12-months"]),
  interest: z.enum(["architecture", "construction", "interior", "exterior", "project-management", "draughting", "all"]),
  motivation: z.string().min(20, "Please share a brief motivation (20+ chars)"),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});
export type TraineeInput = z.infer<typeof traineeSchema>;

export const newsletterSchema = z.object({ email: z.string().email() });
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export type LeadFormType = "contact" | "quote" | "careers" | "trainee" | "newsletter";
