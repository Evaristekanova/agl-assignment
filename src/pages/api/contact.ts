import type { NextApiRequest, NextApiResponse } from "next";
import { contactSchema } from "@/schemas/contact-schema";
import { isRateLimited, clientIp } from "@/security/rate-limit";

/**
 * Contact form endpoint (mock backend).
 *
 * Security layers, in order:
 *  1. Method allowlist — POST only.
 *  2. Payload size cap — 16kb, rejects oversized bodies early.
 *  3. Rate limit — max 5 submissions per IP per minute.
 *  4. Honeypot — bots that fill the hidden field get a fake success,
 *     giving them no signal to adapt.
 *  5. Schema re-validation — the same zod schema as the client;
 *     the server never trusts client-side validation.
 */

export const config = {
  api: { bodyParser: { sizeLimit: "16kb" } },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  if (isRateLimited(`contact:${clientIp(req)}`)) {
    return res
      .status(429)
      .json({ message: "Trop de tentatives. Veuillez réessayer dans une minute." });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Veuillez vérifier les champs indiqués et réessayer.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  // Honeypot filled -> almost certainly a bot. Respond with success so
  // the bot learns nothing, but do not process the submission.
  if (parsed.data.website) {
    return res.status(200).json({ ok: true });
  }

  // Mock processing: a real implementation would queue an email / CRM
  // entry here. Deliberately not logging the submission content —
  // no PII in server logs.
  return res.status(200).json({ ok: true });
}
