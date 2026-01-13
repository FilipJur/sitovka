import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

interface Props {
  studies: any[];
  testimonials: any[];
}

export const CaseStudiesTabs = ({ studies, testimonials }: Props) => {
  const defaultTab = studies.length > 0 ? studies[0].tabLabel : "reference";

  return (
    <Tabs.Root defaultValue={defaultTab} className="flex flex-col">
      <Tabs.List className="flex flex-wrap w-full gap-2.5">
        {studies.map((study) => (
          <Trigger
            key={study.tabLabel}
            value={study.tabLabel}
            label={study.tabLabel}
          />
        ))}
        <Trigger value="reference" label="Reference" />
      </Tabs.List>

      <div className="bg-brand-green rounded-b-[60px] p-8 md:p-12 text-brand-dark min-h-[500px]">
        {studies.map((study) => (
          <Tabs.Content
            key={study.tabLabel}
            value={study.tabLabel}
            className="outline-none animate-in fade-in duration-300 h-full"
          >
            <CaseStudyPanel study={study} />
          </Tabs.Content>
        ))}

        <Tabs.Content
          value="reference"
          className="outline-none animate-in fade-in duration-300 h-full flex items-center"
        >
          <div className="w-full">
            <TestimonialsCarousel items={testimonials} />
          </div>
        </Tabs.Content>
      </div>
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
