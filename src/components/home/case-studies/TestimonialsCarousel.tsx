import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  items: any[];
  showNavButtons?: boolean;
}

export interface TestimonialsCarouselRef {
  reInit: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
}

const TestimonialsCarousel = forwardRef<TestimonialsCarouselRef, Props>(
  ({ items, showNavButtons = true }, ref) => {
    const [canScroll, setCanScroll] = useState({ prev: false, next: false });

    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: "start",
      loop: true,
      dragFree: false,
      skipSnaps: false,
      dragThreshold: 20,
      duration: 30,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    });

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;
      setCanScroll({
        prev: emblaApi.canScrollPrev(),
        next: emblaApi.canScrollNext(),
      });
    }, [emblaApi]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelectIndex = React.useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelectIndex();
      emblaApi.on("select", onSelectIndex);
      return () => {
        emblaApi.off("select", onSelectIndex);
      };
    }, [emblaApi, onSelectIndex]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, onSelect]);

    const scrollTo = React.useCallback(
      (index: number) => emblaApi && emblaApi.scrollTo(index),
      [emblaApi],
    );

    useImperativeHandle(
      ref,
      () => ({
        reInit: () => {
          if (emblaApi) {
            emblaApi.reInit();
            onSelect();
          }
        },
        canScrollPrev: () => emblaApi?.canScrollPrev() ?? false,
        canScrollNext: () => emblaApi?.canScrollNext() ?? false,
      }),
      [emblaApi, onSelect],
    );

    return (
      <>
        <div className="flex items-center w-full">
          {showNavButtons && items.length >= 2 && (
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="hidden md:flex p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Předchozí reference"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}
          {showNavButtons && items.length < 2 && (
            <div className="w-0 md:w-auto" />
          )}
          <div className="embla flex-1 min-w-0 w-full">
            <div
              className="embla__viewport w-full overflow-hidden"
              ref={emblaRef}
            >
              <div className="embla__container w-full flex">
                {items.map((item, idx) => (
                  <div
                    key={item.name || idx}
                    className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_calc(100%/3)] xl:flex-[0_0_25%] min-w-0 px-2.5"
                  >
                    <div className="flex flex-col text-sm">
                      <div className="flex gap-5 mb-[30px] items-center flex-wrap">
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
                      <div className="mb-[30px]">
                        <div
                          className="font-book italic text-brand-dark"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                      {item.name && (
                        <div className="font-bold text-brand-dark">
                          {item.name}
                        </div>
                      )}
                      {item.role && (
                        <div className="font-book text-brand-dark">
                          {item.role}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="embla__slide flex-[0_0_100%] min-w-0">
                    <div className="p-6 bg-white/10 rounded-3xl">
                      <p className="font-book italic text-brand-dark">
                        Žádné reference k dispozici.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showNavButtons && items.length >= 2 && (
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="hidden md:flex p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Další reference"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
          {showNavButtons && items.length < 2 && (
            <div className="w-0 md:w-auto" />
          )}
        </div>

        {items.length >= 2 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={`testimonial-dot-${index}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === selectedIndex ? "bg-brand-dark w-8" : "bg-white/50",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </>
    );
  },
);

TestimonialsCarousel.displayName = "TestimonialsCarousel";

export default TestimonialsCarousel;
