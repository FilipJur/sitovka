import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/assets/logo.svg?react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface NavItem {
  name: string;
  href: string;
  variant?: "primary" | "outline" | "dark";
}

const navItems: NavItem[] = [
  { name: "Úvod", href: "#" },
  { name: "Co umíme", href: "#co-umime", variant: "outline" },
  {
    name: "Reference",
    href: "#pripadove-studie?tab=reference",
    variant: "primary",
  },
  { name: "Kontakty", href: "#kontakty" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Handle nav link clicks (close menu and scroll)
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string) => {
      closeMenu();

      // Handle #pripadove-studie special case with query params
      if (href.startsWith("#pripadove-studie")) {
        e.preventDefault();

        const hash = href.split("?")[0];
        const params = new URLSearchParams(href.split("?")[1] || "");
        const tab = params.get("tab");

        // Update URL
        window.history.pushState(null, "", href);

        // Scroll to section
        const section = document.querySelector(hash);
        if (section) {
          const headerHeight = 144;
          const elementPosition =
            section.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        // Dispatch tab change event
        if (tab) {
          const event = new CustomEvent("pripadove-studie-tab-change", {
            detail: { tab },
          });
          document.dispatchEvent(event);
        }
      }
    },
    [],
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white">
        <div className="w-full max-w-[1140px] mx-auto h-24 md:h-36 flex items-center justify-between px-5">
          {/* Logo */}
          <a href="/#" className="shrink-0 group" aria-label="Domů">
            <Logo className="h-10 w-auto" aria-hidden="true" />
          </a>

          {/* Desktop Navigation & CTA */}
          <div className="flex items-center gap-4 md:gap-10">
            {/* Desktop Nav */}
            <nav className="hidden min-[880px]:flex items-center">
              {navItems.map((item, index) => {
                const isLast = index === navItems.length - 1;
                const nextItem = navItems[index + 1];
                const needsMargin =
                  !isLast &&
                  (item.variant === undefined ||
                    nextItem.variant === undefined);
                const buttonGap = !isLast && item.variant && nextItem.variant;

                return item.variant ? (
                  <Button
                    key={item.name}
                    href={item.href}
                    variant={item.variant}
                    textColor={
                      item.variant === "outline" ? "brand-dark" : undefined
                    }
                    className={cn(
                      "py-2.5",
                      needsMargin && "mr-5",
                      buttonGap && "mr-px",
                    )}
                  >
                    {item.name}
                  </Button>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-base font-bold italic text-brand-dark hover:text-brand-green transition-colors",
                      needsMargin && "mr-5",
                    )}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>

            {/* CTA Button - Visible at ≥ 400px, hidden at < 400px */}
            <div className="hidden min-[400px]:block">
              <Button
                href="#poptavka"
                variant="dark"
                className="py-2.5 text-base px-4 md:px-8"
              >
                Poptávka
              </Button>
            </div>

            {/* Mobile Menu Trigger - Visible at < 880px */}
            <button
              onClick={toggleMenu}
              className="min-[880px]:hidden text-brand-dark p-2 hover:text-brand-green transition-colors"
              aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Visible at < 880px */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white min-[880px]:hidden"
            onClick={(e) => {
              // Close when clicking outside the content
              if (e.target === e.currentTarget) {
                closeMenu();
              }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 100 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              // Close on swipe left
              if (info.offset.x < -50) {
                closeMenu();
              }
            }}
          >
            {/* Close Button (top right) */}
            <div className="absolute top-0 right-0 p-6 pt-9">
              <button
                onClick={closeMenu}
                className="text-brand-dark p-2 hover:text-brand-green transition-colors"
                aria-label="Zavřít menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col items-center justify-center h-full px-8">
              {/* Navigation Links - All at text-base (16px) */}
              <nav className="flex flex-col items-center gap-8">
                {navItems.map((item, index) =>
                  item.variant ? (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Button
                        href={item.href}
                        variant={item.variant}
                        textColor={
                          item.variant === "outline" ? "brand-dark" : undefined
                        }
                        className="text-base py-3 px-10"
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        {item.name}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className="text-base font-bold italic text-brand-dark hover:text-brand-green transition-colors"
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.name}
                    </motion.a>
                  ),
                )}

                {/* Poptávka CTA - Only visible in menu at < 400px */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1 }}
                  className="max-[399px]:block hidden"
                >
                  <Button
                    href="#poptavka"
                    variant="dark"
                    className="text-base py-3 px-12"
                  >
                    Poptávka
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
