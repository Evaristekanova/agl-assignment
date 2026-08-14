import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import type { TextField } from "@/lib/types";
import type { RenderingProps } from "../registry";
import { Text } from "../fields/Text";

interface ContactFormFields {
  heading?: TextField;
  intro?: TextField;
  successMessage?: TextField;
}

type SubmitStatus = "idle" | "success" | "error";

/**
 * Contact form rendering. Heading, intro and success message are
 * editor-controlled content; validation uses react-hook-form + the
 * shared zod schema for instant client-side feedback, and the API route
 * re-validates with the same schema. Includes a honeypot field,
 * accessible error announcements, and the full submit lifecycle
 * (loading / success / server error).
 */
export function ContactForm({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as ContactFormFields;
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Text
            field={fields.heading}
            tag="h2"
            className="text-3xl font-bold tracking-tight text-slate-900"
          />
          <Text field={fields.intro} tag="p" className="mt-3 text-slate-600" />
          <div className="mt-8">
            <Form
              successMessage={
                fields.successMessage?.value ?? "Merci pour votre message."
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Form({ successMessage }: { successMessage: string }) {
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
        const body = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(
          body?.message ?? "Une erreur est survenue. Veuillez réessayer."
        );
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900"
      >
        <p className="font-semibold">Message envoyé</p>
        <p className="mt-1">{successMessage}</p>
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
        <Field label="Nom *" error={errors.name?.message} id="name">
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            className={inputClasses(!!errors.name)}
          />
        </Field>
        <Field label="Email *" error={errors.email?.message} id="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className={inputClasses(!!errors.email)}
          />
        </Field>
      </div>

      <Field label="Sujet" error={errors.subject?.message} id="subject">
        <input
          id="subject"
          type="text"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          {...register("subject")}
          className={inputClasses(!!errors.subject)}
        />
      </Field>

      <Field label="Message *" error={errors.message?.message} id="message">
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
          className={inputClasses(!!errors.message)}
        />
      </Field>

      {/* Honeypot: visually hidden and skipped by keyboard/screen readers.
          Humans never fill it; bots usually do. Checked server-side. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Société</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return `w-full rounded-md border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-slate-300 focus:border-brand focus:ring-brand-soft"
  }`;
}
