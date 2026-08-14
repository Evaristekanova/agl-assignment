import { z } from "zod";

/**
 * Single source of truth for contact-form validation.
 * Used by react-hook-form on the client (instant feedback) and re-run
 * on the API route on the server (client validation is a UX feature,
 * never a security boundary).
 *
 * Required fields follow the design: e-mail, objet and message carry an
 * asterisk; name, phone and company are optional.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Le nom ne doit pas dépasser 100 caractères.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(25, "Le numéro ne doit pas dépasser 25 caractères.")
    .regex(/^[+0-9()\s.-]*$/, "Veuillez saisir un numéro de téléphone valide.")
    .optional()
    .or(z.literal("")),
  email: z
    .email("Veuillez saisir une adresse email valide.")
    .trim()
    .max(200, "L'adresse email ne doit pas dépasser 200 caractères."),
  company: z
    .string()
    .trim()
    .max(100, "Le nom de la société ne doit pas dépasser 100 caractères.")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(2, "Veuillez préciser l'objet de votre message.")
    .max(150, "L'objet ne doit pas dépasser 150 caractères."),
  message: z
    .string()
    .trim()
    .min(10, "Veuillez écrire un message d'au moins 10 caractères.")
    .max(2000, "Le message ne doit pas dépasser 2000 caractères."),
  /** Honeypot — hidden from humans, bots tend to fill it. Checked server-side.
      Named "website" because "company" became a real visible field. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
