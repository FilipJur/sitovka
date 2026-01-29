import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@/hooks/use-media-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface HeroProps {
  cards: any[];
}

const LAYOUT_CONFIG = [
  [83.88, 7.5, 4.44, 2.5, 1.66],
  [19.44, 63.33, 10.27, 4.44, 2.5],
  [4.44, 13.88, 63.33, 13.88, 4.44],
  [2.5, 4.44, 10.27, 63.33, 19.44],
  [1.66, 2.5, 4.44, 7.5, 83.88],
];

export const HeroAccordion = ({ cards }: HeroProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeIndex, setActiveIndex] = useState(0);
  const currentLayout = LAYOUT_CONFIG[activeIndex] || LAYOUT_CONFIG[0];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      loop: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  return (
    <>
      <div className="block lg:hidden w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-0">
            {cards.map((card, index) => (
              <motion.div
                key={`mobile-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.15 },
                  y: {
                    type: "spring",
                    stiffness: 50,
                    damping: 12,
                    mass: 0.8,
                    delay: index * 0.15,
                  },
                }}
                className={cn(
                  "flex-[0_0_100%] min-w-0 mr-4 relative rounded-[40px] overflow-hidden",
                  card.theme === "green" ? "bg-brand-green" : "bg-[#F5F5F5]",
                )}
                style={{
                  backgroundImage: card.image
                    ? `url(${card.image.src})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="aspect-square" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
                  <div className="relative z-10 pointer-events-none">
                    <h2 className="font-brand-heading leading-[0.9] text-5xl">
                      <span
                        className={
                          card.theme === "green" || card.image
                            ? "text-white"
                            : "text-brand-dark"
                        }
                      >
                        {card.highlight}
                      </span>
                      <br />
                      <span
                        className={
                          card.theme === "green" || card.image
                            ? "text-brand-dark"
                            : "text-brand-green"
                        }
                      >
                        {card.headline}
                      </span>
                    </h2>
                  </div>

                  <div className="max-w-xs relative z-10">
                    <p className="text-base font-book text-brand-dark">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex ? "bg-brand-green w-8" : "bg-gray-300",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:flex w-full flex-col lg:flex-row md:gap-2.5 xl:gap-5 h-auto lg:h-[400px] select-none">
        {cards.map((card, index) => {
          const isActive = index === activeIndex;
          const targetWidth = isDesktop ? `${currentLayout[index]}%` : "100%";

          return (
            <motion.div
              key={index}
              layout={isDesktop}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                width: targetWidth,
                boxShadow:
                  isActive && isDesktop
                    ? "0 15px 30px -5px rgba(0, 0, 0, 0.15)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: { duration: 0.6, delay: index * 0.15 },
                y: {
                  type: "spring",
                  stiffness: 50,
                  damping: 12,
                  mass: 0.8,
                  delay: index * 0.15,
                },
                width: {
                  type: "spring",
                  stiffness: 50,
                  damping: 12,
                  mass: 0.8,
                },
                boxShadow: { duration: 0.3 },
              }}
              onClick={() => setActiveIndex(index)}
              whileHover={{
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.15)",
                filter: "brightness(0.9)",
              }}
              style={{
                backgroundImage: card.image ? `url(${card.image.src})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className={cn(
                "relative rounded-[60px] overflow-hidden cursor-pointer",
                "w-full h-[400px] lg:h-[400px] lg:w-auto",
                !card.image &&
                  (card.theme === "green" ? "bg-brand-green" : "bg-[#F5F5F5]"),
                isActive && isDesktop ? "z-10" : "",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 p-8 flex flex-col justify-between transition-opacity duration-300 h-fit",
                  isDesktop && !isActive
                    ? "opacity-40 lg:opacity-100"
                    : "opacity-100",
                )}
              >
                <div className="relative z-10 pointer-events-none">
                  <h2
                    className={cn(
                      "font-brand-heading leading-[0.9] transition-all duration-500",
                      isDesktop && isActive
                        ? "text-[80px] xl:text-display leading-30 whitespace-nowrap"
                        : "text-[80px] xl:text-display leading-30 whitespace-nowrap",
                    )}
                  >
                    <span
                      className={
                        card.theme === "green" || card.image
                          ? "text-white"
                          : "text-brand-dark"
                      }
                    >
                      {card.highlight}
                    </span>
                    <br />
                    <span
                      className={
                        card.theme === "green" || card.image
                          ? "text-brand-dark"
                          : "text-brand-green"
                      }
                    >
                      {card.headline}
                    </span>
                  </h2>
                </div>

                <motion.div
                  animate={{
                    opacity: isDesktop && !isActive ? 0 : 1,
                    y: isDesktop && !isActive ? 20 : 0,
                  }}
                  className="max-w-md relative z-10 pointer-events-none"
                >
                  <p className="text-lg font-book text-brand-dark">
                    {card.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
