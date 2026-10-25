"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, Clock, X, ShieldCheck, QrCode as QrIcon } from "lucide-react";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  itemTitle: string;
  claimantName: string;
  expiresAt?: string;
}

export default function QrCodeModal({
  isOpen,
  onClose,
  token,
  itemTitle,
  claimantName,
  expiresAt,
}: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && token && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        token,
        {
          width: 240,
          margin: 2,
          color: {
            dark: "#041b11", // Deep forest obsidian
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `KIIT-Handover-QR-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm aura-card p-6 text-center text-white relative shadow-2xl border border-white/10">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="aura-dot-live" />
            <span>Secure Handover Pass</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="mt-4 font-bold text-base text-white line-clamp-1">
          {itemTitle}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Issued to: <span className="font-semibold text-white">{claimantName}</span>
        </p>

        {/* QR Code Canvas */}
        <div className="my-5 flex items-center justify-center p-3.5 rounded-2xl border border-emerald-500/20 bg-white shadow-xl shadow-emerald-950/40">
          <canvas ref={canvasRef} className="rounded-xl" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Valid 24h • One-Time Safe Zone Scan</span>
        </div>

        <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
          Present this cryptographic token to Campus Security at the Safe Zone during physical item handover.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 pt-4 border-t border-white/10">
          <button
            onClick={handleCopy}
            className="aura-btn-secondary !py-2.5 !px-3 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="aura-btn-primary !py-2.5 !px-3 text-xs font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Download className="h-3.5 w-3.5" /> Save Image
          </button>
        </div>
      </div>
    </div>
  );
}