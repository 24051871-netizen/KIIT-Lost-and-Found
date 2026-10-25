import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                KIIT<span className="text-emerald-400">FIND</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Official campus property recovery protocol for KIIT Deemed to be University. Zero-Trust architecture deployed across 24 campuses.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/browse" className="hover:text-emerald-400 transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition-colors">
                  Report Found / Lost Property
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-emerald-400 transition-colors">
                  QR Handover Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Handover Points */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Safe Zone Nodes
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>Campus 15 Gate 1 Security Desk</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>Campus 6 Central Library Desk</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>KSAC Student Activity Centre</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Helplines */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Emergency Contact
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Control Room: 0674-2725113</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>KSAC Desk: 0674-2741998</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                <span>lostfound@kiit.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>
            KIIT Deemed to be University // School of Computer Engineering
          </p>
          <div className="flex gap-6 font-mono text-[11px]">
            <span className="text-zinc-400">IEEE 830 Verified</span>
            <span className="text-zinc-400">Statute 14 Governance</span>
            <span className="text-zinc-400">20.3540° N</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
