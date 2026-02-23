import React, { useState, useRef, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import TestimonialsCarousel, {
  type TestimonialsCarouselRef,
} from "./TestimonialsCarousel";
import { CaseStudyPanel } from "./CaseStudyPanel";
import type { CaseStudy } from "./CaseStudyPanel";

interface Props {
  studies: CaseStudy[];
  testimonials: any[];
}

export const CaseStudiesTabs = ({
  studies,
  testimonials,
  initialTab,
}: Props & {
  initialTab?: string | null;
}) => {
  const caseStudyTabLabels = studies.map((s) => s.tabLabel);
  const allTabLabels = [...caseStudyTabLabels, "reference"];

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

  // Navigation handlers
  const goToPrevTab = () => {
    const currentIndex = allTabLabels.indexOf(activeTab);
    if (currentIndex > 0) {
      const prevTab = allTabLabels[currentIndex - 1];
      handleTabChange(prevTab);
    }
  };

  const goToNextTab = () => {
    const currentIndex = allTabLabels.indexOf(activeTab);
    if (currentIndex < allTabLabels.length - 1) {
      const nextTab = allTabLabels[currentIndex + 1];
      handleTabChange(nextTab);
    }
  };

  const isFirstTab = activeTab === allTabLabels[0];
  const isLastTab = activeTab === allTabLabels[allTabLabels.length - 1];
  const isReferenceTab = activeTab === "reference";

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
        className={`relative bg-brand-green rounded-b-[60px] text-brand-dark min-h-[450px] ${
          activeTab === "reference" ? "p-8 md:py-12 md:px-0" : "p-8 md:p-12"
        }`}
      >
        {/* Navigation arrows - desktop only, not for reference tab */}
        {!isReferenceTab && (
          <>
            {/* Left arrow */}
            <button
              onClick={goToPrevTab}
              disabled={isFirstTab}
              className={cn(
                "hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20",
                "w-9 h-9 items-center justify-center",
                "transition-opacity duration-300",
                isFirstTab
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100 hover:opacity-70",
              )}
              aria-label="Předchozí případová studie"
            >
              <ChevronLeft className="w-9 h-9 text-white" strokeWidth={1.5} />
            </button>

            {/* Right arrow */}
            <button
              onClick={goToNextTab}
              disabled={isLastTab}
              className={cn(
                "hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20",
                "w-9 h-9 items-center justify-center",
                "transition-opacity duration-300",
                isLastTab
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100 hover:opacity-70",
              )}
              aria-label="Další případová studie"
            >
              <ChevronRight className="w-9 h-9 text-white" strokeWidth={1.5} />
            </button>
          </>
        )}

        {studies.map((study, index) => (
          <Tabs.Content
            key={study.tabLabel}
            value={study.tabLabel}
            className="outline-none h-full data-[state=inactive]:hidden"
            data-delay={`${index * 100}`}
            data-sb-field-path={`caseStudies.items.${index}`}
          >
            <CaseStudyPanel study={study} className="h-full" />
          </Tabs.Content>
        ))}

        <Tabs.Content
          value="reference"
          className="outline-none h-full flex items-center data-[state=inactive]:hidden"
          data-delay="400"
        >
          <div className="flex flex-col w-full">
            <TestimonialsCarousel
              ref={carouselRef}
              items={testimonials}
              showNavButtons={testimonials.length > 4}
            />
          </div>
        </Tabs.Content>
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
