import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface LogoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  name?: string;
  href?: string;
}

interface Props {
  logos: LogoItem[];
}

export const LogoCarousel = ({ logos }: Props) => {
  // Performance consideration:
  // Using triplication to avoid Embla's visible wrap animation
  // Trade-off: 3x DOM nodes vs smooth visual experience
  // Suitable for simple logo content, reconsider for complex slides
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Check if we're in browser environment for window access
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      watchDrag: true, // ✅ Allow dragging for accessibility
      containScroll: "trimSnaps",
      dragFree: false,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true, // ✅ Stop on drag for accessibility
        stopOnMouseEnter: true,
        playOnInit: !prefersReducedMotion,
      }),
    ],
  );

  // Fix memory leaks - cleanup carousel instance
  useEffect(() => {
    return () => {
      if (emblaApi) {
        emblaApi.destroy();
      }
    };
  }, [emblaApi]);

  if (!logos || logos.length === 0) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Warning: Logo carousel - No logos data available
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
      role="region"
      aria-label={`Client logos carousel, showing ${logos.length} logos for infinite scroll effect`}
    >
      <div className="flex touch-pan-y gap-2.5" aria-roledescription="carousel">
        {duplicatedLogos.map((logo, index) => {
          const isOriginal = index < logos.length;
          const accessibilityProps = !isOriginal
            ? {
                tabIndex: -1,
                "aria-hidden": true,
              }
            : {};

          const slideContent = (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt || logo.name || "Client logo"}
                className="max-h-20 w-auto object-contain"
              />
            </div>
          );

          return (
            <div
              key={`${logo.src}-${index}`}
              className="flex-[0_0_calc((100%-20px)/3)] md:flex-[0_0_calc((100%-40px)/5)] min-w-0 bg-brand-surface rounded-[60px] h-50 flex items-center justify-center hover:grayscale-0 transition-all duration-500 grayscale"
              {...accessibilityProps}
            >
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                  aria-label={`Visit ${logo.name || "client"} website`}
                >
                  {slideContent}
                </a>
              ) : (
                slideContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

LogoCarousel.displayName = "LogoCarousel";
