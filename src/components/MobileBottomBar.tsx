"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, QrCode, Home, ShieldCheck } from "lucide-react";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Catalog", icon: Compass },
    { href: "/report", label: "Report", icon: PlusCircle, isPrimary: true },
    { href: "/scan", label: "QR Scan", icon: QrCode },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-2 rounded-full border border-white/20 bg-black/85 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-mono text-[11px] font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all mx-1"
              >
                <span className="nothing-red-dot"></span>
                <span>REPORT</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-full text-[10px] font-mono transition-all active:scale-95 ${
                isActive
                  ? "text-white bg-white/10 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-0.5 text-[9px] uppercase tracking-wider">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
