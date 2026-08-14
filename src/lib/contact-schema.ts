import { z } from "zod";

/**
 * Single source of truth for contact-form validation.
 * Used by react-hook-form on the client (instant feedback) and re-run
 * on the API route on the server (client validation is a UX feature,
 * never a security boundary).
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Veuillez saisir votre nom (au moins 2 caractères).")
    .max(100, "Le nom ne doit pas dépasser 100 caractères."),
  email: z
    .email("Veuillez saisir une adresse email valide.")
    .trim()
    .max(200, "L'adresse email ne doit pas dépasser 200 caractères."),
  subject: z
    .string()
    .trim()
    .max(150, "Le sujet ne doit pas dépasser 150 caractères.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Veuillez écrire un message d'au moins 10 caractères.")
    .max(2000, "Le message ne doit pas dépasser 2000 caractères."),
  /** Honeypot — hidden from humans, bots tend to fill it. Checked server-side. */
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
