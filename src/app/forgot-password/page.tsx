"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { REQUEST_PASSWORD_RESET } from "@/store/UserStore/UserStore.graphql";
import { toast } from "@/ui/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  useEffect(() => {
    const q = params.get("email");
    if (q) setEmail(q);
    else {
      const cached =
        typeof window !== "undefined"
          ? localStorage.getItem("lastResetEmail")
          : null;
      if (cached) setEmail(cached);
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await requestReset({ variables: { email } });
      try {
        localStorage.setItem("lastResetEmail", email);
      } catch {}
      setSuccess(true);
      toast.success("If that email exists, we’ve sent reset instructions.");
    } catch (err: any) {
      const msg =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "Something went wrong. Try again later.";
      if (/too many/i.test(msg))
        toast.error("Too many requests. Please try again in a few minutes.");
      else toast.error(msg);
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="mx-auto mt-8 rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-neutral-500">
              We’ll email you a link to reset it.
            </p>
          </div>

          {success ? (
            <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
              If that email exists, we’ve sent you reset instructions.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md bg-white border border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-md px-4 py-2 font-medium text-white ${
                  loading
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-sky-500 hover:opacity-95"
                }`}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/(auth)/login")}
                className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-50"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
