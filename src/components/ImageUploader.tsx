"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Image as ImageIcon, ShieldCheck } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onImageUploaded, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setPreview(base64Data);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data }),
        });

        const data = await res.json();
        if (data.success && data.imageUrl) {
          onImageUploaded(data.imageUrl);
          setProvider(data.provider);
        } else {
          // Fallback to local base64
          onImageUploaded(base64Data);
        }
      } catch (err) {
        console.warn("Upload endpoint failed, utilizing client preview:", err);
        onImageUploaded(base64Data);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {preview ? (
        <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group">
          <Image
            src={preview}
            alt="Uploaded item photo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>

          {provider && (
            <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] text-white backdrop-blur flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-kiit-400" />
              {provider}
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-kiit-500 bg-slate-50/70 hover:bg-kiit-50/30 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-kiit-950/20 cursor-pointer transition-all p-4 text-center"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-kiit-600" />
              <span className="text-xs text-slate-500 font-medium">Processing & uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-kiit-100 text-kiit-700 dark:bg-kiit-950 dark:text-kiit-300">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Click to upload item photo
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  PNG, JPG or WebP up to 5MB (Cloudinary CDN supported)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
