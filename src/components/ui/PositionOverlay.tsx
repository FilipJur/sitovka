import React from "react";
import { cn } from "../../utils/cn";

interface PositionOverlayProps {
  children: React.ReactNode;
  bottom?: string;
  left?: string;
  className?: string;
  pointerEvents?: "none" | "auto";
}

export const PositionOverlay: React.FC<PositionOverlayProps> = ({
  children,
  bottom = "0",
  left = "1/2",
  className,
  pointerEvents = "none",
}) => {
  const positionClasses = cn(
    "absolute",
    bottom === "0"
      ? "bottom-0"
      : bottom?.includes("px")
        ? ""
        : `bottom-${bottom}`,
    left === "1/2" ? "left-1/2" : left?.includes("px") ? "" : `left-${left}`,
    left === "1/2" && "-translate-x-1/2",
    bottom === "0" && "translate-y-1/2",
    pointerEvents === "none" ? "pointer-events-none" : "pointer-events-auto",
    className,
  );

  const inlineStyles: React.CSSProperties = {
    ...(bottom?.includes("px") && { bottom }),
    ...(left?.includes("px") && { left: left === "1/2" ? "50%" : left }),
  };

  return (
    <div className={positionClasses} style={inlineStyles}>
      {children}
    </div>
  );
};
