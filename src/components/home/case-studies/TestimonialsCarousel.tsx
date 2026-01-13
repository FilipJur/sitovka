import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  items: any[];
}

export const TestimonialsCarousel = ({ items }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
            >
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <p className="font-book italic text-brand-dark">
                    "{item.quote}"
                  </p>
                  <div className="font-brand-heading text-brand-dark">
                    {item.client}
                  </div>
                </div>
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
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
          aria-label="Předchozí reference"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
          aria-label="Další reference"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
