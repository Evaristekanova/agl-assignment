import { useState, type FormEvent } from "react";
import type { TextField } from "@/types";
import type { RenderingProps } from "../registry";
import { Text } from "../fields/Text";
import { Button } from "../ui/Button";
import { newsletterSchema } from "@/schemas/newsletter-schema";

interface NewsletterSignupFields {
  heading?: TextField;
  text?: TextField;
  placeholder?: TextField;
  buttonLabel?: TextField;
  successMessage?: TextField;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter band on the brand gradient. All copy is editor-controlled;
 * the email is validated client-side with the same zod schema the API
 * route re-validates with.
 */
export function NewsletterSignup({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as NewsletterSignupFields;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? "Adresse email invalide.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(body?.message ?? "Une erreur est survenue. Veuillez réessayer.");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  }

  return (
    <section className="bg-linear-to-br from-grad-from to-grad-to py-14 text-white sm:py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Text
          field={fields.heading}
          tag="h2"
          className="text-2xl font-bold sm:text-3xl"
        />
        <Text
          field={fields.text}
          tag="p"
          className="mt-3 text-lg font-light text-white/90 sm:text-xl"
        />

        {status === "success" ? (
          <p
            role="status"
            className="mx-auto mt-8 max-w-md rounded-full bg-white/15 px-6 py-3 font-medium ring-1 ring-white/30"
          >
            {fields.successMessage?.value ?? "Merci pour votre inscription."}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={fields.placeholder?.value ?? "Votre adresse email"}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              className="w-full flex-1 rounded-full border-0 bg-white px-5 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/70"
            />
            <Button type="submit" variant="ink" size="lg" disabled={status === "submitting"}>
              {status === "submitting"
                ? "Envoi…"
                : fields.buttonLabel?.value ?? "S'inscrire"}
            </Button>
          </form>
        )}

        {status === "error" && error && (
          <p id="newsletter-error" role="alert" className="mt-3 text-sm font-medium text-white">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
