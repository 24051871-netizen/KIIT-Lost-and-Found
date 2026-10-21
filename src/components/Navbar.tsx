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
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center border border-white/30 bg-white/5 text-white group-hover:border-white transition-all">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-[0.2em] uppercase text-white">
                    KIIT // FIND
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.2 border border-white/20 bg-white/5 text-zinc-300">
                    PROTOCOL
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-zinc-500">
                  DEEMED TO BE UNIVERSITY // LAT 20.3540° N
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] transition-all py-1 ${
                    isActive
                      ? "text-white font-bold border-b-2 border-white"
                      : "text-zinc-400 hover:text-white"
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
              className="spacex-btn-primary !py-2 !px-4 !text-[11px]"
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
                  className="border border-white/20 p-1.5 text-zinc-400 hover:text-white hover:border-white transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoLoginModal(true)}
                  className="spacex-btn-secondary !py-2 !px-3 !text-[11px]"
                >
                  DEMO SIGN IN
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="spacex-btn-primary !py-2 !px-3 !text-[11px]"
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
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 dark:border-slate-800 dark:bg-slate-900">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="h-4 w-4 text-kiit-600" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setDemoLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Quick Demo Switcher
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Demo Login Modal for examiner grading & local dev */}
      {demoLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-black p-6 border border-white/20 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white" />
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-white">
                  DEMO TELEMETRY ACCESS
                </h3>
              </div>
              <button
                onClick={() => setDemoLoginModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-mono">
              Select an authorized KIIT profile to test zero-knowledge claiming and QR protocol verification without external OAuth redirect:
            </p>
            <div className="mt-5 space-y-3">
              <button
                onClick={() => handleDemoLogin("STUDENT")}
                className="w-full flex items-center justify-between p-3.5 border border-white/15 bg-white/5 hover:border-white hover:bg-white/10 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-xs tracking-wider uppercase text-white flex items-center gap-2">
                    Aman Sharma
                    <span className="text-[10px] font-mono bg-white/10 border border-white/20 px-1.5 py-0.5 text-zinc-300">
                      ROLL: 2105128
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">KP-7 // 2105128@kiit.ac.in</div>
                </div>
                <span className="text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform">
                  INITIALIZE &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoLogin("SECURITY")}
                className="w-full flex items-center justify-between p-3.5 border border-white/15 bg-white/5 hover:border-white hover:bg-white/10 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-xs tracking-wider uppercase text-white flex items-center gap-2">
                    Campus 15 Security
                    <span className="text-[10px] font-mono bg-white/20 border border-white/30 px-1.5 py-0.5 text-white">
                      OFFICER
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Safe Zone Desk // security.campus15@kiit.ac.in
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform">
                  INITIALIZE &rarr;
                </span>
              </button>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setDemoLoginModal(false);
                  signIn("google");
                }}
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest font-mono"
              >
                Or Authenticate with Live Google OAuth &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
