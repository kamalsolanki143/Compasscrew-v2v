import { Shield } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0218] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-purple-200/50">
          <Shield className="h-4 w-4 text-purple-400" />
          <span>&copy; 2026 EscapeHer. All rights reserved.</span>
        </div>

        <nav className="flex gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-purple-200/50 transition-colors hover:text-purple-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
