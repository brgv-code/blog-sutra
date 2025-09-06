"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Feature } from "@/types";
import { features } from "@/utils/features";

import { Sparkles, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30">
      <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Sutra
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="text-muted hover:text-foreground transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-accent-500 to-primary-500 text-white px-4 py-2 rounded-lg hover:from-accent-600 hover:to-primary-600 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-6">
              The Future of
              <br />
              Note-Taking
            </h1>

            <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto">
              Experience the most advanced note-taking platform with AI
              assistance, multi-tenant collaboration, and beautiful themes.
              Perfect for individuals and teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-accent-500 to-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-accent-600 hover:to-primary-600 transition-all duration-200 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="border border-border text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all duration-200"
              >
                Try Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-accent-500" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-accent-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-accent-500" />
                Full access to all features
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to be productive
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Powerful features that make note-taking and collaboration
              effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: Feature, index: number) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-background p-6 rounded-xl border border-border hover:shadow-soft transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to transform your note-taking?
          </h2>
          <p className="text-xl text-muted mb-8">
            Join thousands of users who have already upgraded their productivity
          </p>

          <button
            onClick={() => router.push("/register")}
            className="bg-gradient-to-r from-accent-500 to-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-accent-600 hover:to-primary-600 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="border-t border-border bg-surface/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Sutra
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Docs
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted">
            © 2025 Sutra. All rights reserved. • Built with ❤️ for productivity
            enthusiasts
          </div>
        </div>
      </footer>
    </div>
  );
}
