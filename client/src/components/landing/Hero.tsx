"use client";

import { motion } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0533] via-[#2d0a4e] to-[#4a0e2e] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-red-500 shadow-lg shadow-purple-500/25"
        >
          <Shield className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Your Safety, Our{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Priority
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-2xl text-lg leading-relaxed text-purple-200/80 sm:text-xl"
        >
          An AI-powered emergency response system that watches over you 24/7.
          Instant SOS alerts, smart heartbeat check-ins, and automatic escalation
          to keep you and your loved ones safe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/signup"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98]"
          >
            Get Started
          </Link>
          <button
            onClick={scrollToFeatures}
            className="inline-flex h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToFeatures}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 z-10 cursor-pointer text-purple-300/60 transition-colors hover:text-purple-300"
        aria-label="Scroll to features"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
