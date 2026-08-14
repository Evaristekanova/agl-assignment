import type { NextApiRequest, NextApiResponse } from "next";
import { newsletterSchema } from "@/schemas/newsletter-schema";
import { isRateLimited, clientIp } from "@/security/rate-limit";

/**
 * Newsletter signup endpoint (mock backend). Same layered approach as
 * /api/contact: method allowlist, payload cap, rate limit, schema
 * re-validation on the server.
 */

export const config = {
  api: { bodyParser: { sizeLimit: "4kb" } },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  if (isRateLimited(`newsletter:${clientIp(req)}`)) {
    return res
      .status(429)
      .json({ message: "Trop de tentatives. Veuillez réessayer dans une minute." });
  }

  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse email valide." });
  }

  // Mock processing: a real implementation would call the email
  // marketing platform here. No PII is logged.
  return res.status(200).json({ ok: true });
}
