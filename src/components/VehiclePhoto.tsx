"use client";

import Image from "next/image";
import { useState } from "react";

import { VehicleIllustration } from "@/components/VehicleIllustration";

type PhotoImage = { url: string; alt?: string | null };

/**
 * Photo area for a listing card: swipeable dots when there are several photos,
 * and a body-type illustration when the vehicle has none yet.
 */
export function VehiclePhoto({
  images,
  bodyType,
  exteriorColor,
  title,
  priority = false,
}: {
  images: PhotoImage[];
  bodyType: string;
  exteriorColor?: string | null;
  title: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-full w-full bg-ink-100">
        <VehicleIllustration
          bodyType={bodyType}
          exteriorColor={exteriorColor}
          className="h-full w-full"
        />
      </div>
    );
  }

  const current = images[Math.min(index, images.length - 1)];

  return (
    <div className="group/photo relative h-full w-full overflow-hidden bg-ink-100">
      <Image
        src={current.url}
        alt={current.alt || title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="object-cover"
        priority={priority}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.preventDefault();
              setIndex((value) => (value - 1 + images.length) % images.length);
            }}
            className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink-800 shadow-sm transition group-hover/photo:flex hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.preventDefault();
              setIndex((value) => (value + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink-800 shadow-sm transition group-hover/photo:flex hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5">
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Photo ${dotIndex + 1}`}
                onClick={(event) => {
                  event.preventDefault();
                  setIndex(dotIndex);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
