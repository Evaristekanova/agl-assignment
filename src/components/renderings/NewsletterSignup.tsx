import { useState, type FormEvent } from "react";
import { toast } from "sonner";
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

/**
 * Newsletter band on the brand gradient. All copy is editor-controlled;
 * the email is validated client-side with the same zod schema the API
 * route re-validates with. Invalid input is announced inline next to the
 * field; the backend outcome (subscribed / server error) is a toast.
 */
export function NewsletterSignup({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as NewsletterSignupFields;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Adresse email invalide.");
      return;
    }
    setFieldError(null);
    setSubmitting(true);
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
        throw new Error(
          body?.message ?? "Une erreur est survenue. Veuillez réessayer.",
        );
      }
      toast.success(
        fields.successMessage?.value ?? "Merci pour votre inscription.",
      );
      setEmail("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setSubmitting(false);
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
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? "newsletter-error" : undefined}
            className="w-full flex-1 rounded-full border-0 bg-white px-5 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/70"
          />
          <Button type="submit" variant="ink" size="lg" disabled={submitting}>
            {submitting ? "Envoi…" : fields.buttonLabel?.value ?? "S'inscrire"}
          </Button>
        </form>

        {fieldError && (
          <p
            id="newsletter-error"
            role="alert"
            className="mt-3 text-sm font-medium text-white"
          >
            {fieldError}
          </p>
        )}
      </div>
    </section>
  );
}
