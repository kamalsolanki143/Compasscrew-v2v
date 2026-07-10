"use client";

import { motion } from "framer-motion";
import { Siren, HeartPulse, ArrowUpCircle } from "lucide-react";

const steps = [
  {
    icon: Siren,
    number: "01",
    title: "Trigger SOS",
    description:
      "Press the emergency button or use a voice command to instantly activate an SOS alert.",
    gradient: "from-red-500 to-rose-600",
    glow: "shadow-red-500/30",
  },
  {
    icon: HeartPulse,
    number: "02",
    title: "Heartbeat Check-ins",
    description:
      "The system sends periodic check-ins. Confirm you're safe, or silence triggers escalation.",
    gradient: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/30",
  },
  {
    icon: ArrowUpCircle,
    number: "03",
    title: "Smart Escalation",
    description:
      "If no response is received, emergency contacts and authorities are automatically notified.",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/30",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#0f0520] px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
            How It Works
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Three steps to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              peace of mind
            </span>
          </h2>
        </motion.div>

        <div className="relative grid items-start gap-8 lg:grid-cols-3 lg:gap-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.glow} transition-transform hover:scale-110`}
                >
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1a0a30] text-xs font-bold text-purple-300">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-purple-200/50">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute left-[calc(50%+56px)] top-10 hidden h-px w-[calc(100%-112px)] bg-gradient-to-r from-purple-500/40 to-transparent lg:block">
                  <motion.div
                    animate={{ x: [0, 20, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-t border-r border-purple-400/60"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
