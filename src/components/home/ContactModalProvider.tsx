import React, { useEffect, useState } from "react";
import { ContactModal } from "./ContactModal";

interface Person {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar?: any;
}

interface ContactModalProviderProps {
  featuredPeople: Person[];
  contactsSectionId: string;
}

export const ContactModalProvider: React.FC<ContactModalProviderProps> = ({
  featuredPeople,
  contactsSectionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for custom event to open modal
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-poptavka-modal", handleOpenModal);

    return () => {
      window.removeEventListener("open-poptavka-modal", handleOpenModal);
    };
  }, [contactsSectionId]);

  return (
    <ContactModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      people={featuredPeople}
    />
  );
};

ContactModalProvider.displayName = "ContactModalProvider";

export default ContactModalProvider;
