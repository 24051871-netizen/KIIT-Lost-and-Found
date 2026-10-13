import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-kiit-700 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">KIIT-Find</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official Campus Lost & Found recovery network designed for KIIT students, faculty, and hostel residents across Campuses 1 to 24.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/browse" className="hover:text-kiit-600">
                  Browse Active Items
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-kiit-600">
                  Report a Lost / Found Item
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-kiit-600">
                  QR Handover Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Handover Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official Handover Points
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-kiit-600 shrink-0" />
                <span>Campus 15 Gate Security Desk (School of Computer Engg.)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-kiit-600 shrink-0" />
                <span>Campus 6 Central Library Circulation Counter</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-kiit-600 shrink-0" />
                <span>KSAC Student Help Desk (Student Activity Centre)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-kiit-600 shrink-0" />
                <span>King&apos;s Palace &amp; Queen&apos;s Castle Caretaker Offices</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Campus Security Helplines
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-kiit-600" />
                <span>Central Control: 0674-2725113</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-kiit-600" />
                <span>KSAC Desk: 0674-2741998</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-kiit-600" />
                <span>lostfound@kiit.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} KIIT Deemed to be University, Bhubaneswar, Odisha. Designed for School of Computer Engineering.
          </p>
        </div>
      </div>
    </footer>
  );
}
