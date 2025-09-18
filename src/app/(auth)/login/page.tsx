"use client";

import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import { currentUserVar } from "@/store/UserStore/UserStore";
import { ME } from "@/store/UserStore/UserStore.graphql";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, ArrowLeft, Zap } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const client = useApolloClient();
  const currentUser = useReactiveVar(currentUserVar);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Login via BetterAuth
      const res = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (res.error) {
        setError(res.error.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      // 2. Fetch current user via Apollo
      const { data } = await client.query({
        query: ME,
        fetchPolicy: "network-only",
      });

      if (data?.me) {
        currentUserVar(data.me);
        router.push("/dashboard");
      } else {
        setError("Could not fetch user after login.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Back to home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Sutra
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h1>

          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted">
              Continue with email
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all pr-10"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-border text-accent-500 focus:ring-accent-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-muted">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-accent-500 hover:text-accent-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-500 to-primary-500 text-white py-3 rounded-lg font-semibold hover:from-accent-600 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-muted">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-accent-500 hover:text-accent-600 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-lg">
          <h3 className="font-semibold text-accent-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Demo Mode Available
          </h3>
          <p className="text-sm text-accent-600 mb-2">
            Experience the complete Sutra workspace without creating an account.
          </p>
          <ul className="text-xs text-accent-600 space-y-1">
            <li>• All 15 beautiful themes</li>
            <li>• Multi-tab editing interface</li>
            <li>• AI writing assistant</li>
            <li>• Complete file management</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
