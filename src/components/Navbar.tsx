"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Compass,
  PlusCircle,
  QrCode,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoginModal, setDemoLoginModal] = useState(false);

  const navLinks = [
    { href: "/browse", label: "Catalog", icon: Compass },
    { href: "/report", label: "Report Item", icon: PlusCircle },
    { href: "/scan", label: "QR Handover", icon: QrCode },
  ];

  const handleDemoLogin = async (role: "STUDENT" | "SECURITY") => {
    const email =
      role === "STUDENT" ? "2105128@kiit.ac.in" : "security.campus15@kiit.ac.in";
    await signIn("kiit-demo-login", {
      email,
      role,
      callbackUrl: pathname || "/",
    });
    setDemoLoginModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                <ShieldCheck className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    KIIT<span className="text-emerald-400">FIND</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    PROTOCOL 2.5
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
                  Zero-Trust Campus Recovery
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Refined Frosted Island */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-zinc-950 font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="btn-emerald !py-2.5 !px-5 !text-xs font-semibold"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Report Item</span>
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {(session.user as any).rollNumber || (session.user as any).role || "KIIT NODE"}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="rounded-full border border-white/15 p-2 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoLoginModal(true)}
                  className="btn-secondary !py-2 !px-4 !text-xs"
                >
                  Demo Nodes
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary !py-2 !px-4 !text-xs"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2.5 text-zinc-300 border border-white/15 bg-white/5 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#07090e]/95 px-5 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] text-xs font-medium text-zinc-200 hover:bg-white/[0.06]"
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setDemoLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 text-xs font-medium rounded-full border border-white/15 bg-white/5 text-white"
              >
                Quick Demo Switcher
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Demo Login Modal */}
      {demoLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md glass-card !bg-[#0b0e17]/95 p-7 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Telemetry Access Switcher
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Switch demo credentials for testing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDemoLoginModal(false)}
                className="rounded-full p-1.5 border border-white/10 text-zinc-400 hover:text-white hover:border-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
              Select an authorized institutional profile to test zero-knowledge claiming and QR handover verification without external OAuth redirect:
            </p>
            <div className="mt-5 space-y-3">
              <button
                onClick={() => handleDemoLogin("STUDENT")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/5 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-2">
                    Aman Sharma
                    <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300">
                      Roll: 2105128
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-1">KP-7 Hostel // School of Computer Engineering</div>
                </div>
                <span className="text-xs font-mono font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Enter &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoLogin("SECURITY")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-2">
                    Campus 15 Security Officer
                    <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full text-cyan-300">
                      SAFE ZONE DESK
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-1">
                    Gate 1 Checkpoint // Handover Scanner Node
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Enter &rarr;
                </span>
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setDemoLoginModal(false);
                  signIn("google");
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Or authenticate with live Google OAuth &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
