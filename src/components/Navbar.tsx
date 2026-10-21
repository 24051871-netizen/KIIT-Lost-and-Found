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
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoginModal, setDemoLoginModal] = useState(false);

  const navLinks = [
    { href: "/browse", label: "Browse Catalog", icon: Compass },
    { href: "/report", label: "Report Item", icon: PlusCircle },
    { href: "/scan", label: "QR Handover Scan", icon: QrCode },
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
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand - Nothing (R) Style */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-zinc-950/80 text-white group-hover:border-white transition-all shadow-[inset_0_0_12px_rgba(255,255,255,0.06)]">
                <span className="nothing-red-dot"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <span className="font-ndot text-base sm:text-lg tracking-[0.2em] text-white">
                    KIIT (R)
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full border border-white/20 bg-white/5 text-zinc-300">
                    FIND OS 2.5
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-zinc-500">
                  RECOVERY NETWORK // 20.3540° N
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Stadium Pills */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nothing-pill-tab ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="nothing-btn-primary !py-2.5 !px-5 !text-[10px]"
            >
              + REPORT ITEM
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/15">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                    {(session.user as any).rollNumber || (session.user as any).role || "KIIT"}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="rounded-full border border-white/20 p-2 text-zinc-400 hover:text-white hover:border-white transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoLoginModal(true)}
                  className="nothing-btn-secondary !py-2 !px-4 !text-[10px]"
                >
                  DEMO ACCESS
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="nothing-btn-primary !py-2 !px-4 !text-[10px]"
                >
                  KIIT OAUTH
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2.5 text-zinc-300 border border-white/15 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/15 bg-black/95 px-5 pt-3 pb-6 space-y-2.5 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 text-xs font-mono uppercase tracking-wider text-zinc-200 hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-white" />
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
                className="w-full text-center py-3 text-xs font-mono tracking-widest uppercase rounded-full border border-white/20 bg-white/5 text-white"
              >
                Quick Demo Switcher
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Demo Login Modal for examiner grading & local dev - Nothing OS Styling */}
      {demoLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md nothing-widget !bg-black/90 p-7 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="nothing-red-dot"></span>
                <h3 className="font-ndot text-sm text-white">
                  ACCESS OVERRIDE
                </h3>
              </div>
              <button
                onClick={() => setDemoLoginModal(false)}
                className="rounded-full p-1.5 border border-white/10 text-zinc-400 hover:text-white hover:border-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-400 leading-relaxed font-mono">
              Select an authorized KIIT node to test zero-knowledge claiming and QR protocol verification without external OAuth redirect:
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleDemoLogin("STUDENT")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/15 bg-white/[0.03] hover:border-white hover:bg-white/10 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-xs tracking-wider uppercase text-white flex items-center gap-2 font-mono">
                    Aman Sharma
                    <span className="text-[10px] font-mono bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-zinc-300">
                      ROLL 2105128
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-1">KP-7 HOSTEL // CS DEPT</div>
                </div>
                <span className="text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform">
                  INITIALIZE &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoLogin("SECURITY")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/15 bg-white/[0.03] hover:border-white hover:bg-white/10 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-xs tracking-wider uppercase text-white flex items-center gap-2 font-mono">
                    Campus 15 Security
                    <span className="text-[10px] font-mono bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded-full text-red-200">
                      OFFICER NODE
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-1">
                    Safe Zone Desk // Campus 15
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform">
                  INITIALIZE &rarr;
                </span>
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setDemoLoginModal(false);
                  signIn("google");
                }}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest font-mono"
              >
                Authenticate with Live Google OAuth &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
