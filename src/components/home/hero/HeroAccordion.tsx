import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@/hooks/use-media-query";

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

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 h-auto lg:h-[400px]">
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
              scale: isActive && isDesktop ? 1.02 : 1,
              boxShadow:
                isActive && isDesktop
                  ? "0 15px 30px -5px rgba(0, 0, 0, 0.15)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.5, delay: index * 0.1 },
              y: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8,
                delay: index * 0.1,
              },
              width: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
              scale: { type: "spring", stiffness: 200, damping: 20 },
              boxShadow: { duration: 0.3 },
            }}
            onClick={() => setActiveIndex(index)}
            whileHover={{
              scale: isDesktop ? 1.01 : 1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            style={{
              backgroundImage: card.image ? `url(${card.image.src})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={cn(
              "relative rounded-[60px] overflow-hidden cursor-pointer transition-colors duration-500",
              "w-full h-[400px] lg:h-[400px] lg:w-auto",
              !card.image &&
                (card.theme === "green" ? "bg-brand-green" : "bg-[#F5F5F5]"),
              isActive && isDesktop ? "z-10" : "hover:brightness-95",
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
                      ? "text-[80px] xl:text-[120px]"
                      : "text-4xl lg:text-3xl whitespace-nowrap",
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
  );
};
