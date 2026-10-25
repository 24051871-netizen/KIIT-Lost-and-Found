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
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoginModal, setDemoLoginModal] = useState(false);

  const navLinks = [
    { href: "/browse", label: "Browse Catalog", icon: Compass },
    { href: "/report", label: "Report Lost/Found", icon: PlusCircle },
    { href: "/scan", label: "Safe Zone Scanner", icon: QrCode },
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
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/75 backdrop-blur-2xl transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                <ShieldCheck className="h-6 w-6 text-emerald-400 group-hover:scale-105 transition-transform" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    KIIT <span className="text-emerald-400 font-medium">Find</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    CAMPUS 1–24
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  Zero-Trust Property Recovery
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDemoLoginModal(true)}
              className="aura-btn-secondary !py-2.5 !px-4 !text-xs !rounded-full"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Demo Roles
            </button>

            <Link
              href="/report"
              className="aura-btn-primary !py-2.5 !px-5 !text-xs !rounded-full"
            >
              <PlusCircle className="h-4 w-4" />
              Report Item
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {(session.user as any).rollNumber || (session.user as any).role || "KIIT"}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2.5 text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#07090e]/95 px-5 pt-3 pb-6 space-y-2.5 backdrop-blur-3xl animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-all"
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
                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold rounded-full border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Quick Role Switcher (Student / Security)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Demo Login Modal */}
      {demoLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md aura-surface p-7 shadow-2xl shadow-emerald-950/40 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Interactive Role Switcher
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Switch between demo profiles to test verification flows
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDemoLoginModal(false)}
                className="rounded-full p-1.5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed">
              Experience the dual-sided Zero-Trust protocol as either an authenticated KIIT student or an official Campus Security Officer:
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => handleDemoLogin("STUDENT")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    Aman Sharma
                    <span className="text-[10px] font-mono bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-slate-300">
                      Roll 2105128
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Student • KP-7 Hostel • CSE Dept
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Login as Student <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>

              <button
                onClick={() => handleDemoLogin("SECURITY")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    Campus 15 Security Desk
                    <span className="text-[10px] font-semibold bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-full text-cyan-300">
                      Safe Zone Node
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Authorized Checkpoint • Gate 1 Desk
                  </div>
                </div>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Login as Officer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setDemoLoginModal(false);
                  signIn("google");
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
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
