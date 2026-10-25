import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07090e] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                KIIT <span className="text-emerald-400 font-medium">Find</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Zero-Trust campus property recovery network for KIIT Deemed to be University. Designed for seamless security across 24 academic campuses.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/browse" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  Browse Catalog
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  Report Found Property
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  Official Safe Zone Scanner
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Zone Hubs */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Safe Zone Checkpoints
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>Campus 15 (CSE) Gate 1 Security</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>Campus 6 Central Library Circulation</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>KSAC Student Activity Centre</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Helplines */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Emergency Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Campus Control: 0674-2725113</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>KSAC Helpdesk: 0674-2741998</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                <span>lostfound@kiit.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            KIIT Deemed to be University • School of Computer Engineering
          </p>
          <div className="flex gap-6 text-slate-400 font-medium">
            <span>IEEE 830 Compliant</span>
            <span>Zero-Trust ZK-MOP</span>
            <span>Bhubaneswar, Odisha</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
