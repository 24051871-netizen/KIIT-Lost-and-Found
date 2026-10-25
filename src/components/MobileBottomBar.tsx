"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, QrCode, Home } from "lucide-react";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Catalog", icon: Compass },
    { href: "/report", label: "Report", icon: PlusCircle, isPrimary: true },
    { href: "/scan", label: "Scan QR", icon: QrCode },
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1.5 p-2 rounded-full border border-white/[0.12] bg-[#07090e]/85 backdrop-blur-3xl shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isPrimary) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-all mx-1"
              >
                <PlusCircle className="h-4 w-4 text-slate-950" />
                <span>Report</span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                isActive
                  ? "text-emerald-400 bg-white/[0.08] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span className="mt-0.5 text-[10px] tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
