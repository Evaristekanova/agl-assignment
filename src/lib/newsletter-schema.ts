import { z } from "zod";

/** Shared client + server validation for the newsletter signup. */
export const newsletterSchema = z.object({
  email: z
    .email("Veuillez saisir une adresse email valide.")
    .trim()
    .max(200, "L'adresse email ne doit pas dépasser 200 caractères."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
