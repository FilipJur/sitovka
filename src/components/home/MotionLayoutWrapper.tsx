import { motion } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const MotionLayoutWrapper = ({ children, className }: Props) => (
  <motion.div
    layout
    transition={{ type: "spring", bounce: 0, duration: 0.3, mass: 0.7 }}
    className={className}
  >
    {children}
  </motion.div>
);

MotionLayoutWrapper.displayName = "MotionLayoutWrapper";
