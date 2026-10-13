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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-kiit-700 via-kiit-600 to-emerald-400 text-white shadow-md shadow-kiit-600/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  KIIT-Find
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-kiit-100 text-kiit-800 dark:bg-kiit-950 dark:text-kiit-300">
                    Campus Portal
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  KIIT Deemed to be University
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-kiit-50 text-kiit-700 font-semibold dark:bg-kiit-950/60 dark:text-kiit-400"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 rounded-lg bg-kiit-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-kiit-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Report Item
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[130px]">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {(session.user as any).rollNumber || (session.user as any).role || "KIIT"}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoLoginModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Demo Login
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-kiit-200 bg-kiit-50 px-3 py-2 text-xs font-medium text-kiit-800 hover:bg-kiit-100 dark:border-kiit-800 dark:bg-kiit-950 dark:text-kiit-300"
                >
                  <User className="h-3.5 w-3.5" />
                  Sign In (@kiit.ac.in)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-kiit-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Quick Demo Access
                </h3>
              </div>
              <button
                onClick={() => setDemoLoginModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For academic grading or offline demonstration, select a pre-configured KIIT role to test claiming and QR verification without entering external OAuth credentials:
            </p>
            <div className="mt-5 space-y-3">
              <button
                onClick={() => handleDemoLogin("STUDENT")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-kiit-500 hover:bg-kiit-50/50 dark:border-slate-700 dark:hover:bg-kiit-950/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    Aman Sharma (Student)
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                      Roll: 2105128
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">Hostel KP-7 • 2105128@kiit.ac.in</div>
                </div>
                <span className="text-xs font-semibold text-kiit-600 group-hover:translate-x-0.5 transition-transform">
                  Login &rarr;
                </span>
              </button>

              <button
                onClick={() => handleDemoLogin("SECURITY")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-kiit-500 hover:bg-kiit-50/50 dark:border-slate-700 dark:hover:bg-kiit-950/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    Campus 15 Gate Security
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded">
                      Staff / Guard
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Handover Point Desk • security.campus15@kiit.ac.in
                  </div>
                </div>
                <span className="text-xs font-semibold text-kiit-600 group-hover:translate-x-0.5 transition-transform">
                  Login &rarr;
                </span>
              </button>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => {
                  setDemoLoginModal(false);
                  signIn("google");
                }}
                className="text-xs text-kiit-600 hover:underline font-medium"
              >
                Or sign in with live Google OAuth (@kiit.ac.in)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
