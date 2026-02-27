import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface MobileTabDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const MobileTabDropdown: React.FC<MobileTabDropdownProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative md:hidden">
      {/* Trigger Button - Styled as active tab */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full py-5 px-6 rounded-t-[60px] text-base font-brand-heading transition-all duration-300 select-none",
          "bg-brand-green text-brand-dark flex items-center justify-between",
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate text-lg">{activeOption?.label}</span>
        <div className="w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-brand-dark/5 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Options List */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 bg-white rounded-b-[20px] z-50 overflow-hidden"
              role="listbox"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full py-5 px-6 text-left font-brand-heading transition-all duration-200",
                    "hover:bg-brand-green",
                    option.value === value
                      ? "bg-brand-green text-brand-dark"
                      : "bg-white text-brand-dark",
                  )}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.15 }}
                >
                  <span className="truncate">{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTabDropdown;
