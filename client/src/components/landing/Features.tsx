"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  ArrowUpCircle,
  BrainCircuit,
  MapPin,
  Lock,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    icon: HeartPulse,
    title: "Heartbeat Protocol",
    description:
      "Periodic check-ins ensure you're safe. Miss one, and help is on the way automatically.",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconBg: "from-pink-500 to-rose-500",
  },
  {
    icon: ArrowUpCircle,
    title: "Smart Escalation",
    description:
      "If you can't respond, trusted contacts and emergency services are notified instantly.",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconBg: "from-purple-500 to-violet-500",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Analysis",
    description:
      "Advanced AI analyzes incident patterns and provides actionable evidence summaries.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "Live Location Tracking",
    description:
      "Real-time GPS tracking shared with trusted contacts during active emergencies.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "from-emerald-500 to-teal-500",
  },
  {
    icon: Lock,
    title: "Secure Evidence",
    description:
      "Discreetly capture audio and photos as evidence, encrypted and stored securely.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Emergency Contacts",
    description:
      "Build a trusted circle of contacts who are alerted the moment you need help.",
    gradient: "from-red-500/20 to-pink-500/20",
    iconBg: "from-red-500 to-pink-500",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative bg-gradient-to-b from-[#0f0520] to-[#1a0a30] px-6 py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
            Features
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              stay safe
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-200/60">
            A comprehensive safety suite built with cutting-edge technology to
            protect you when it matters most.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.06]"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`}
              />

              <div className="relative z-10">
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.iconBg} shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-purple-200/50">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
