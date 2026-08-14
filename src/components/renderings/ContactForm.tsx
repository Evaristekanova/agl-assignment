import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/schemas/contact-schema";
import type { TextField } from "@/types";
import type { RenderingProps } from "../registry";
import { Text } from "../fields/Text";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Send } from "lucide-react";

interface ContactFormFields {
  heading?: TextField;
  intro?: TextField;
  successMessage?: TextField;
  nameLabel?: TextField;
  namePlaceholder?: TextField;
  phoneLabel?: TextField;
  phonePlaceholder?: TextField;
  emailLabel?: TextField;
  emailPlaceholder?: TextField;
  companyLabel?: TextField;
  companyPlaceholder?: TextField;
  subjectLabel?: TextField;
  subjectPlaceholder?: TextField;
  messageLabel?: TextField;
  messagePlaceholder?: TextField;
  buttonLabel?: TextField;
}

type SubmitStatus = "idle" | "success" | "error";

const value = (field: TextField | undefined, fallback: string) =>
  field?.value ?? fallback;

/**
 * Contact form rendering. All copy — heading, intro, field labels,
 * placeholders, button, success message — is editor-controlled content;
 * only the validation rules live in code (they are a security boundary,
 * shared with the API route via the zod schema). Includes a honeypot
 * field, accessible error announcements, and the full submit lifecycle
 * (loading / success / server error).
 */
export function ContactForm({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as ContactFormFields;
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Text
          field={fields.heading}
          tag="h2"
          className="text-center text-2xl font-bold tracking-tight text-[#24466b] sm:text-3xl"
        />
        <Text
          field={fields.intro}
          tag="p"
          className="mt-3 text-center text-lg text-slate-600"
        />
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100 sm:p-10">
          <Form fields={fields} />
        </div>
      </div>
    </section>
  );
}

function Form({ fields }: { fields: ContactFormFields }) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          body?.message ?? "Une erreur est survenue. Veuillez réessayer.",
        );
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer.",
      );
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-900"
      >
        <p className="font-semibold">Message envoyé</p>
        <p className="mt-1">
          {value(fields.successMessage, "Merci pour votre message.")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-green-800 underline hover:text-green-900"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  /* Paired short fields, rendered on one row from the sm breakpoint. */
  const pairedInputs: {
    key: keyof ContactInput;
    label: string;
    placeholder: string;
    type: string;
    autoComplete: string;
    required: boolean;
  }[] = [
    {
      key: "name",
      label: value(fields.nameLabel, "Nom / Prénom (s)"),
      placeholder: value(fields.namePlaceholder, "Votre nom complet"),
      type: "text",
      autoComplete: "name",
      required: false,
    },
    {
      key: "phone",
      label: value(fields.phoneLabel, "N° Tél"),
      placeholder: value(fields.phonePlaceholder, "+250 XX XX XX XX"),
      type: "tel",
      autoComplete: "tel",
      required: false,
    },
    {
      key: "email",
      label: value(fields.emailLabel, "E-mail"),
      placeholder: value(fields.emailPlaceholder, "votre@email.com"),
      type: "email",
      autoComplete: "email",
      required: true,
    },
    {
      key: "company",
      label: value(fields.companyLabel, "Société"),
      placeholder: value(fields.companyPlaceholder, "Nom de votre société"),
      type: "text",
      autoComplete: "organization",
      required: false,
    },
  ];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "error" && serverError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {pairedInputs.map(
          ({ key, label, placeholder, type, autoComplete, required }) => (
            <Input
              key={key}
              id={key}
              label={label}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              required={required}
              error={errors[key]?.message}
              {...register(key)}
            />
          ),
        )}
      </div>

      <Input
        id="subject"
        label={value(fields.subjectLabel, "Objet")}
        type="text"
        placeholder={value(fields.subjectPlaceholder, "Objet de votre message")}
        required
        error={errors.subject?.message}
        {...register("subject")}
      />

      <Textarea
        id="message"
        label={value(fields.messageLabel, "Message")}
        rows={6}
        placeholder={value(fields.messagePlaceholder, "Votre message...")}
        required
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Honeypot: visually hidden and skipped by keyboard/screen readers.
          Humans never fill it; bots usually do. Checked server-side. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-[#24466b] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a3552] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24466b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Envoi…" : value(fields.buttonLabel, "Envoyer")}
        </button>
      </div>
    </form>
  );
}
