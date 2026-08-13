"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type UploadedImage = { url: string; alt?: string };

export function ImageUploader({
  name,
  initial = [],
}: {
  name: string;
  initial?: UploadedImage[];
}) {
  const [images, setImages] = useState<UploadedImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      list.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "Upload failed.");
      setImages((current) => [...current, ...data.urls.map((url: string) => ({ url }))]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length) upload(event.dataTransfer.files);
        }}
        className={`rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? "border-amber-brand-400 bg-amber-brand-50" : "border-ink-300 bg-ink-50"
        }`}
      >
        <svg viewBox="0 0 24 24" className="mx-auto h-9 w-9 text-ink-400" fill="none">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="mt-2 text-sm font-semibold text-ink-800">
          Drag photos here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-amber-brand-600 underline"
          >
            browse your device
          </button>
        </p>
        <p className="mt-1 text-xs text-ink-500">
          JPEG, PNG, WebP, or AVIF · up to 8 MB each · first photo is the main one
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && upload(event.target.files)}
        />

        {busy && <p className="mt-3 text-sm font-semibold text-ink-700">Uploading…</p>}
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      </div>

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={`${image.url}-${index}`}
              className="overflow-hidden rounded-lg border border-ink-200 bg-white"
            >
              <div className="relative aspect-[4/3] bg-ink-100">
                <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink-900/90 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
                    Main
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <div className="flex gap-1">
                  <IconButton label="Move left" onClick={() => move(index, index - 1)} disabled={index === 0}>
                    ←
                  </IconButton>
                  <IconButton
                    label="Move right"
                    onClick={() => move(index, index + 1)}
                    disabled={index === images.length - 1}
                  >
                    →
                  </IconButton>
                </div>
                <button
                  type="button"
                  onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                  className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-ink-200 px-1.5 py-0.5 text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
