"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check, Clock, X, ShieldCheck } from "lucide-react";

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
          width: 256,
          margin: 2,
          color: {
            dark: "#064e3b", // KIIT deep emerald
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-sm glass-card !bg-[#0b0e17]/95 p-6 sm:p-7 text-center text-slate-100 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <span className="live-beacon"></span>
            Campus Handover Pass
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="mt-4 font-bold text-base text-white line-clamp-1">
          {itemTitle}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Issued to: <span className="font-semibold text-emerald-400">{claimantName}</span>
        </p>

        {/* QR Code Canvas */}
        <div className="my-5 flex items-center justify-center p-3.5 rounded-2xl border border-white/10 bg-white shadow-lg">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        <div className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-300 font-medium px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Valid 24h &bull; One-Time Verification</span>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 leading-snug">
          Present this cryptographic pass to the finder or Campus Security Guard at Campus 15 Safe Zone to finalize physical handover.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
          <button
            onClick={handleCopy}
            className="btn-secondary !py-2.5 !px-3 !text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Token
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="btn-emerald !py-2.5 !px-3 !text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download QR
          </button>
        </div>
      </div>
    </div>
  );
}
