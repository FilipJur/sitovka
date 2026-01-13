import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  items: any[];
}

export const TestimonialsCarousel = ({ items }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center">
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="p-3 rounded-full hover:bg-primary transition-colors"
        aria-label="Předchozí reference"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 px-2.5"
            >
              <div className="flex flex-col text-sm">
                <div className="flex gap-5 mb-[30px] items-center">
                  {item.avatar && (
                    <img
                      src={item.avatar.src}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  {item.logo && (
                    <img
                      src={item.logo.src}
                      alt="Client Logo"
                      className="w-24 h-10 object-contain"
                    />
                  )}
                </div>
                <div className="mb-[30px] ">
                  <div
                    className="font-book italic text-brand-dark"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
                {item.name && (
                  <div className="font-bold text-brand-dark">{item.name}</div>
                )}
                {item.role && (
                  <div className="font-book text-brand-dark">{item.role}</div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex-[0_0_100%] min-w-0">
              <div className="p-6 bg-white/10 rounded-3xl">
                <p className="font-book italic text-brand-dark">
                  Žádné reference k dispozici.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="p-3 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Další reference"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
