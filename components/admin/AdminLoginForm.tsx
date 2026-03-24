"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockKeyhole } from "lucide-react";

interface AdminLoginFormProps {
  isConfigured: boolean;
}

export function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="editorial-card shape-a w-full max-w-md p-7 sm:p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
        <LockKeyhole className="h-6 w-6 text-gold" />
      </div>
      <p className="mt-6 text-[0.68rem] uppercase tracking-[0.4em] text-gold">Private Access</p>
      <h1 className="mt-3 font-display text-5xl leading-none text-cream">Admin login</h1>
      <p className="mt-4 text-sm leading-7 text-cream-muted">
        Sign in with the configured admin email or username and password to manage
        featured plates, availability, and ordering flow.
      </p>

      {!isConfigured ? (
        <p className="mt-5 border border-danger/35 bg-danger/10 px-4 py-3 text-sm leading-6 text-cream">
          Admin login is not configured. Set <code>ADMIN_USER</code> or{" "}
          <code>ADMIN_USEREMAIL</code> and <code>ADMIN_PASS</code> in{" "}
          <code>.env.local</code>.
        </p>
      ) : null}

      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);

          if (!isConfigured) {
            setError("Admin login is not configured yet.");
            return;
          }

          setSubmitting(true);

          try {
            const response = await signIn("credentials", {
              identifier: identifier.trim(),
              password,
              redirect: false
            });

            if (response?.error) {
              setError(
                response.error === "CredentialsSignin"
                  ? "The provided credentials were rejected."
                  : "Unable to sign in right now."
              );
              return;
            }

            if (!response?.ok) {
              setError("Unable to sign in right now.");
              return;
            }

            router.push("/admin/dashboard");
            router.refresh();
          } catch {
            setError("Unable to sign in right now.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
            Email or Username
          </label>
          <input
            type="text"
            className="input-dark"
            aria-label="Admin email or username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
            Password
          </label>
          <input
            type="password"
            className="input-dark"
            aria-label="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <button
          type="submit"
          className="gold-button w-full"
          disabled={submitting || !isConfigured}
        >
          {submitting ? "Signing in..." : "Unlock Dashboard"}
        </button>
      </form>
    </div>
  );
}
