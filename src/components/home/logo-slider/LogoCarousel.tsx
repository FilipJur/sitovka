import React from "react";
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: false,
      skipSnaps: false,
      dragThreshold: 20,
      duration: 30,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  );

  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
      role="region"
      aria-label="Client logos carousel"
    >
      <div className="flex touch-pan-y gap-2.5" aria-roledescription="carousel">
        {logos.map((logo, index) => {
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
              className="flex-[0_0_calc((100%-20px)/3)] md:flex-[0_0_calc((100%-40px)/5)] min-w-0 bg-brand-surface rounded-[60px] h-40 flex items-center justify-center hover:grayscale-0 hover:opacity-100 transition-all duration-500 grayscale opacity-60"
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
