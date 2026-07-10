"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0533] via-[#2d0a4e] to-[#4a0e2e] px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-purple-200/70 backdrop-blur-sm">
          <Shield className="h-4 w-4 text-purple-400" />
          Trusted by thousands of users worldwide
        </div>

        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Ready to feel{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            safe
          </span>
          ?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-purple-200/60">
          Join a growing community that prioritizes personal safety with
          AI-powered emergency response. Your peace of mind is one click away.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="group inline-flex h-13 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-13 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
