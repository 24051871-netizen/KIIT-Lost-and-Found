import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center border border-white/30 bg-white/5 text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                KIIT // RECOVERY
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed uppercase tracking-wider">
              Official campus property recovery network for KIIT Deemed to be University. Zero-trust architecture deployed across 24 campuses.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  &gt; BROWSE TELEMETRY
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  &gt; REPORT PROPERTY
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-white transition-colors">
                  &gt; QR SCANNER ENGINE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Handover Points */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">
              SAFE ZONE NODES
            </h4>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-white shrink-0" />
                <span>CAMPUS 15 GATE 1 CHECKPOINT</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-white shrink-0" />
                <span>CAMPUS 6 CENTRAL LIBRARY</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-white shrink-0" />
                <span>KSAC STUDENT ACTIVITY CENTRE</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Helplines */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white">
              EMERGENCY TELEMETRY
            </h4>
            <div className="space-y-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-white" />
                <span>CONTROL // 0674-2725113</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-white" />
                <span>KSAC // 0674-2741998</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-white" />
                <span>lostfound@kiit.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500 gap-4">
          <p>
            KIIT DEEMED TO BE UNIVERSITY // SCHOOL OF COMPUTER ENGINEERING
          </p>
          <div className="flex gap-6">
            <span className="text-zinc-400">IEEE 830 VERIFIED</span>
            <span className="text-zinc-400">STATUTE 14 SECURED</span>
            <span className="text-zinc-400">LAT 20.3540° N</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
