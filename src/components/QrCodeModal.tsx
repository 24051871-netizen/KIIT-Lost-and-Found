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
            dark: "#064e3b", // KIIT deep green
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-kiit-700 dark:text-kiit-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4" />
            Official Handover Pass
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="mt-3 font-bold text-base text-slate-900 dark:text-white line-clamp-1">
          {itemTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Issued to: <span className="font-semibold text-slate-700 dark:text-slate-200">{claimantName}</span>
        </p>

        {/* QR Code Canvas */}
        <div className="my-4 flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/80 dark:border-slate-700">
          <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          <Clock className="h-3.5 w-3.5" />
          <span>Valid for 24 Hours • One-Time Use</span>
        </div>

        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          Present this QR code to the finder or Campus Security Desk during physical item handover.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Token"}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-kiit-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-kiit-700"
          >
            <Download className="h-3.5 w-3.5" />
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}
