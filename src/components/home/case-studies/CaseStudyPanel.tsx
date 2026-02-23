import React from "react";

export interface CaseStudy {
  heading: string;
  descriptionHtml: string;
  image?: {
    src: string;
    width?: number;
    height?: number;
  };
}

interface Props {
  study: CaseStudy;
  className?: string;
}

export const CaseStudyPanel = ({ study, className }: Props) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-brand-heading">{study.heading}</h3>
          <div
            className="text-base font-book leading-relaxed"
            dangerouslySetInnerHTML={{ __html: study.descriptionHtml }}
          />
        </div>
        {study.image && (
          <div className="relative h-64 lg:h-[400px] rounded-3xl overflow-hidden bg-white/10">
            <img
              src={study.image.src}
              alt={study.heading}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};
