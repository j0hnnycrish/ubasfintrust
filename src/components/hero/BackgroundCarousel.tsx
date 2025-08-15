import React, { useEffect, useMemo, useState } from "react";

type BackgroundCarouselProps = {
  images?: string[];
  rotationMs?: number;
  heightVh?: number; // hero height in viewport height units (optional)
  heightClass?: string; // alternative to heightVh: supply Tailwind class like 'h-[60vh]'
  overlayGradient?: string; // tailwind gradient classes or custom
  className?: string;
};

// Helper to parse comma-separated env var safely
function parseEnvList(key: string): string[] | undefined {
  const raw = (import.meta as any)?.env?.[key] as string | undefined;
  if (!raw) return undefined;
  const arr = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

export const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({
  images,
  rotationMs,
  heightVh,
  heightClass,
  overlayGradient,
  className,
}) => {
  const envImages = useMemo(() => parseEnvList("VITE_HERO_IMAGES"), []);
  const imgs = useMemo(() => {
    // Safe defaults use existing placeholder to avoid 404s until real images are configured.
    const safeDefaults = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
    const list = images?.length ? images : envImages ?? safeDefaults;
    return list.length ? list : safeDefaults;
  }, [images, envImages]);

  const interval = rotationMs ?? (Number((import.meta as any)?.env?.VITE_HERO_ROTATION_MS) || 6000);
  const heroHeight = heightVh ?? (Number((import.meta as any)?.env?.VITE_HERO_HEIGHT_VH) || 60);
  const gradient =
    overlayGradient ||
    "bg-gradient-to-b from-black/50 via-black/30 to-black/20 dark:from-black/60 dark:via-black/40 dark:to-black/30";

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return; // no need to rotate
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % imgs.length);
    }, interval);
    return () => clearInterval(id);
  }, [imgs.length, interval]);

  // This component is designed to be placed inside a relative hero section.
  // It positions absolutely to fill the section and sit behind hero content.
  return (
    <div
      className={
        "absolute inset-0 w-full overflow-hidden" +
        (className ? ` ${className}` : "")
      }
      style={!heightClass ? { height: `${heroHeight}vh`, zIndex: 0 } : { zIndex: 0 }}
      aria-hidden
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {imgs.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={
              "absolute inset-0 transition-opacity duration-1000 ease-in-out " +
              (i === index ? "opacity-100" : "opacity-0")
            }
          >
            {/* Use object-cover for full-bleed background */}
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover select-none"
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Overlay for readability */}
      <div className={`absolute inset-0 ${gradient}`} />
    </div>
  );
};

export default BackgroundCarousel;
