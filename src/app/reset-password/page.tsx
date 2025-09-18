"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RESET_PASSWORD,
  REQUEST_PASSWORD_RESET,
} from "../../store/UserStore/UserStore.graphql";
import { toast } from "@/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [requestReset, { loading: resending }] = useMutation(
    REQUEST_PASSWORD_RESET
  );

  const hasToken = Boolean(token);
  useEffect(() => {
    try {
      const e = localStorage.getItem("lastResetEmail");
      if (e) setLastEmail(e);
    } catch {}
  }, []);

  const checks = useMemo(() => {
    return {
      len: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      match: confirm === password && confirm.length > 0,
    };
  }, [password, confirm]);

  const strength = useMemo(() => {
    const score = Object.values({
      len: checks.len,
      upper: checks.upper,
      lower: checks.lower,
      digit: checks.digit,
      symbol: checks.symbol,
    }).filter(Boolean).length;
    if (!password) return { label: "", color: "", pct: 0 };
    if (score >= 5)
      return { label: "Strong", color: "bg-emerald-500", pct: 100 };
    if (score >= 3) return { label: "Medium", color: "bg-amber-500", pct: 66 };
    return { label: "Weak", color: "bg-rose-500", pct: 33 };
  }, [checks, password]);

  const validationError = useMemo(() => {
    if (!hasToken) return "Missing or invalid reset token.";
    if (!password) return "Enter a new password.";
    if (!checks.len) return "Password must be at least 12 characters.";
    if (!checks.upper) return "Include at least one uppercase letter.";
    if (!checks.lower) return "Include at least one lowercase letter.";
    if (!checks.digit) return "Include at least one number.";
    if (!checks.symbol) return "Include at least one special character.";
    if (!checks.match) return "Passwords do not match.";
    return "";
  }, [hasToken, checks, password, confirm]);

  const disabled = loading || Boolean(validationError);

  const handleResend = useCallback(async () => {
    try {
      if (lastEmail) {
        await requestReset({ variables: { email: lastEmail } });
        toast.success("If that email exists, we’ve re‑sent the reset link.");
        return;
      }
      router.push(
        `/forgot-password${
          lastEmail ? `?email=${encodeURIComponent(lastEmail)}` : ""
        }`
      );
    } catch (err: any) {
      const msg =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "Couldn’t resend the link right now.";
      if (/too many/i.test(msg))
        toast.error("Too many requests. Please try again in a few minutes.");
      else toast.error(msg);
    }
  }, [lastEmail, requestReset, router]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (disabled) return;
      try {
        await resetPassword({ variables: { token, newPassword: password } });
        setSuccess(true);
        toast.success("Password reset successfully.");
      } catch (err: any) {
        const msg =
          err?.graphQLErrors?.[0]?.message ||
          err?.message ||
          "Couldn’t reset password. Try again.";
        toast.error(msg);
      }
    },
    [disabled, resetPassword, token, password]
  );

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="mx-auto mt-8 rounded-2xl border border-neutral-300 ring-1 ring-neutral-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Set a new password
            </h1>
            <p className="text-sm text-neutral-500">
              Make it strong and unique to secure your account.
            </p>
          </div>

          {!hasToken && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              Missing or invalid reset token. Please use the link from your
              email.
            </div>
          )}

          {success ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                Your password has been reset successfully.
              </div>
              <button
                type="button"
                onClick={() => router.push("/(auth)/login")}
                className="w-full rounded-md px-4 py-2 font-medium text-white bg-gradient-to-r from-emerald-500 to-sky-500 hover:opacity-95"
              >
                Continue to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md bg-white border border-neutral-300
             focus-visible:outline-none focus:border-emerald-500
             focus:ring-2 focus:ring-emerald-500/30
             outline-none px-3 py-2 pr-24"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs
               text-neutral-600 hover:text-neutral-800
               focus:outline-none focus:ring-2 focus:ring-neutral-300 rounded"
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>

                {password && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-neutral-200">
                      <div
                        className={`h-1.5 rounded ${strength.color}`}
                        style={{ width: `${strength.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Strength: {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">
                  Confirm password
                </label>
                <input
                  type={show ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-md bg-white border border-neutral-300
             focus-visible:outline-none focus:border-emerald-500
             focus:ring-2 focus:ring-emerald-500/30
             outline-none px-3 py-2"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-2 rounded-md border border-neutral-300 bg-neutral-50 p-3">
                {[
                  { ok: checks.len, label: "At least 12 characters" },
                  {
                    ok: checks.upper,
                    label: "Contains an uppercase letter (A–Z)",
                  },
                  {
                    ok: checks.lower,
                    label: "Contains a lowercase letter (a–z)",
                  },
                  { ok: checks.digit, label: "Contains a number (0–9)" },
                  { ok: checks.symbol, label: "Contains a symbol (!@#$…)" },
                  { ok: checks.match, label: "Passwords match" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded ${
                        c.ok
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {c.ok ? "✓" : "•"}
                    </span>
                    <span
                      className={c.ok ? "text-neutral-700" : "text-neutral-500"}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={disabled}
                  className={`w-full rounded-md px-4 py-2 font-medium
      ${
        disabled
          ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
          : "text-white bg-gradient-to-r from-emerald-500 to-sky-500 hover:opacity-95"
      }
      focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full rounded-md border border-neutral-300 bg-white
               text-neutral-700 hover:bg-neutral-50
               disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200
               focus:outline-none focus:ring-2 focus:ring-neutral-300 px-4 py-2"
                >
                  {resending ? "Resending..." : "Resend reset link"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
