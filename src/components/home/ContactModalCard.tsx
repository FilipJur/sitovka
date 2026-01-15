import React from "react";
// Note: In Astro React islands, SVG imports should work the same way
// As long as vite-plugin-svgr is configured

interface Person {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar?: any;
}

interface ContactModalCardProps {
  person: Person;
}

export const ContactModalCard: React.FC<ContactModalCardProps> = ({
  person,
}) => {
  return (
    <div className="flex flex-col items-center text-center mx-auto max-w-sm">
      {person.avatar ? (
        <img
          src={person.avatar.src || person.avatar}
          alt={person.name}
          width={180}
          height={180}
          className="rounded-full w-45 h-45 object-cover mb-[30px] bg-brand-surface"
        />
      ) : (
        <div className="rounded-full w-45 h-45 bg-brand-surface mb-[30px]" />
      )}

      <h3 className="text-lg font-brand-heading text-brand-dark mb-2 uppercase">
        {person.name}
      </h3>

      {person.role && person.role.trim() !== "" && (
        <p className="text-sm font-book text-brand-dark mb-6">{person.role}</p>
      )}

      {(person.email || person.phone) && (
        <div className="text-sm font-book text-brand-dark">
          {person.email && person.email.trim() !== "" && (
            <a
              href={`mailto:${person.email}`}
              className="block hover:text-brand-green transition-colors"
            >
              {person.email}
            </a>
          )}
          {person.phone && person.phone.trim() !== "" && (
            <a
              href={`tel:${person.phone.replace(/\s/g, "")}`}
              className="block hover:text-brand-green transition-colors"
            >
              {person.phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

ContactModalCard.displayName = "ContactModalCard";
