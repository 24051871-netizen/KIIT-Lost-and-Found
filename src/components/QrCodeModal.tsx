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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
      <div className="w-full max-w-sm nothing-widget !bg-black/90 p-7 text-center font-mono text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-[0.2em]">
            <span className="nothing-red-dot"></span>
            HANDOVER PASS
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 border border-white/10 text-zinc-400 hover:text-white hover:border-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="mt-4 font-bold text-sm uppercase tracking-wider text-white line-clamp-1">
          {itemTitle}
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider">
          ISSUED TO: <span className="font-semibold text-white">{claimantName}</span>
        </p>

        {/* QR Code Canvas */}
        <div className="my-5 flex items-center justify-center p-3 rounded-2xl border border-white/20 bg-white">
          <canvas ref={canvasRef} className="shadow-sm rounded-lg" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-300 font-medium uppercase tracking-widest">
          <Clock className="h-3 w-3" />
          <span>VALID 24H // ONE-TIME SCAN</span>
        </div>

        <p className="mt-2 text-[10px] text-zinc-500 leading-tight uppercase tracking-wider">
          Present this cryptographic token to the finder or Campus Security Desk during physical item handover.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <button
            onClick={handleCopy}
            className="nothing-btn-secondary !py-2 !px-2 !text-[9px]"
          >
            {copied ? "COPIED" : "COPY TOKEN"}
          </button>

          <button
            onClick={handleDownload}
            className="nothing-btn-primary !py-2 !px-2 !text-[9px]"
          >
            DOWNLOAD QR
          </button>
        </div>
      </div>
    </div>
  );
}
