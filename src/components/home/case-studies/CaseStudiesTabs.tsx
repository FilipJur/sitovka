import React, { useState, useRef, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import TestimonialsCarousel, {
  type TestimonialsCarouselRef,
} from "./TestimonialsCarousel";

interface Props {
  studies: any[];
  testimonials: any[];
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut" as any,
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn" as any,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as any,
    },
  },
};

export const CaseStudiesTabs = ({
  studies,
  testimonials,
  initialTab,
}: Props & {
  initialTab?: string | null;
}) => {
  const defaultTab = studies.length > 0 ? studies[0].tabLabel : "reference";
  const [activeTab, setActiveTab] = useState(initialTab || defaultTab);
  const carouselRef = useRef<TestimonialsCarouselRef>(null);

  // Listen for custom tab change events
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: string }>;
      setActiveTab(customEvent.detail.tab);
    };

    document.addEventListener(
      "pripadove-studie-tab-change",
      handleTabChange as EventListener,
    );

    // Check initial hash on mount
    const hash = window.location.hash;
    if (hash.startsWith("#pripadove-studie")) {
      const params = new URLSearchParams(hash.split("?")[1] || "");
      const tab = params.get("tab");
      if (tab) {
        setActiveTab(tab);
      }
    }

    return () => {
      document.removeEventListener(
        "pripadove-studie-tab-change",
        handleTabChange as EventListener,
      );
    };
  }, []);

  // Listen for URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#case-studies")) {
        const params = new URLSearchParams(hash.split("?")[1] || "");
        const tab = params.get("tab");
        if (tab) {
          setActiveTab(tab);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Update URL hash when tab changes
    const newHash = `#pripadove-studie?tab=${value}`;
    window.history.replaceState(null, "", newHash);
  };

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className="flex flex-col"
    >
      <Tabs.List className="flex flex-wrap w-full gap-2.5 mb-0 z-10 relative">
        {studies.map((study) => (
          <Trigger
            key={study.tabLabel}
            value={study.tabLabel}
            label={study.tabLabel}
          />
        ))}
        <Trigger value="reference" label="Reference" />
      </Tabs.List>

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0, duration: 0.3, mass: 0.7 }}
        className={`bg-brand-green rounded-b-[60px] text-brand-dark min-h-[450px] ${
          activeTab === "reference" ? "py-8 md:py-12" : "p-8 md:p-12"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {studies.map((study, index) => (
            <Tabs.Content
              key={study.tabLabel}
              value={study.tabLabel}
              forceMount
              className="outline-none h-full data-[state=inactive]:absolute data-[state=inactive]:inset-0 reveal-card"
              data-delay={`${index * 100}`}
            >
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate={activeTab === study.tabLabel ? "visible" : "hidden"}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full"
              >
                <motion.div className="space-y-6" variants={itemVariants}>
                  <motion.h3
                    className="text-3xl font-brand-heading"
                    variants={itemVariants}
                  >
                    {study.heading}
                  </motion.h3>
                  <motion.div
                    className="text-base font-book leading-relaxed"
                    variants={itemVariants}
                    dangerouslySetInnerHTML={{ __html: study.descriptionHtml }}
                  />
                </motion.div>
                {study.image && (
                  <motion.div
                    className="relative h-64 lg:h-[400px] rounded-3xl overflow-hidden bg-white/10"
                    variants={itemVariants}
                  >
                    <img
                      src={study.image.src}
                      alt={study.heading}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </motion.div>
            </Tabs.Content>
          ))}

          <Tabs.Content
            value="reference"
            forceMount
            className="outline-none h-full flex items-center data-[state=inactive]:absolute data-[state=inactive]:inset-0 reveal-card"
            data-delay="400"
          >
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate={activeTab === "reference" ? "visible" : "hidden"}
              className="w-full"
            >
              <TestimonialsCarousel
                ref={carouselRef}
                items={testimonials}
                showNavButtons={testimonials.length > 4}
              />
            </motion.div>
          </Tabs.Content>
        </AnimatePresence>
      </motion.div>
    </Tabs.Root>
  );
};

const Trigger = ({ value, label }: { value: string; label: string }) => (
  <Tabs.Trigger
    value={value}
    className={cn(
      "flex-1 min-w-[120px] py-5 rounded-t-[60px] text-base font-brand-heading transition-all duration-300 select-none",
      "bg-brand-surface text-brand-dark hover:bg-gray-200",
      "data-[state=active]:bg-brand-green data-[state=active]:text-brand-dark",
    )}
  >
    <span className="truncate">{label}</span>
  </Tabs.Trigger>
);
