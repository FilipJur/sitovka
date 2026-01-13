import { config, fields, singleton, collection } from "@keystatic/core";

export default config({
  storage: { kind: "local" },

  singletons: {
    // About Us Section (Benefits + Bio)
    about: singleton({
      label: "2. O Nás",
      path: "src/content/sections/about",
      format: { data: "json" },
      schema: {
        benefits: fields.array(
          fields.object({
            iconId: fields.select({
              label: "Icon",
              options: [
                { label: "Target", value: "target" },
                { label: "Board", value: "board" },
                { label: "Light", value: "light" },
              ],
              defaultValue: "target",
            }),
            titleHashtag: fields.text({ label: "Highlight (e.g. #děláme)" }),
            titleRemainder: fields.text({ label: "Title Text" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Benefits Row",
            itemLabel: (props) =>
              props.fields.titleHashtag.value +
              " " +
              props.fields.titleRemainder.value,
          },
        ),
        bio: fields.object(
          {
            heading: fields.text({
              label: "Row Heading",
              defaultValue: "O nás",
            }),
            col1: fields.markdoc.inline({ label: "Column 1 (Rich Text)" }),
            col2: fields.markdoc.inline({ label: "Column 2 (Rich Text)" }),
            image: fields.image({
              label: "Bleed Image (The Man)",
              directory: "src/assets/images/about",
              publicPath: "@/assets/images/about/",
            }),
          },
          { label: "Bio Section" },
        ),
      },
    }),

    // Services Section (Co umíme)
    services: singleton({
      label: "3. Co umíme",
      path: "src/content/sections/services",
      format: { data: "json" },
      schema: {
        headingHighlight: fields.text({
          label: "Heading Green Part",
          defaultValue: "Co umíme?",
        }),
        headingRemainder: fields.text({ label: "Heading Dark Part" }),
        introText: fields.markdoc.inline({ label: "Intro Text (18px)" }),
        items: fields.array(
          fields.object({
            image: fields.image({
              label: "Service Image",
              directory: "src/assets/images/services",
              publicPath: "@/assets/images/services/",
            }),
            title: fields.text({ label: "Title" }),
            description: fields.markdoc.inline({
              label: "Description",
            }),
          }),
          {
            label: "Services Grid",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),

    // Contacts Section (5. Kontakty)
    contacts: singleton({
      label: "5. Kontakty",
      path: "src/content/sections/contacts",
      format: { data: "json" },
      schema: {
        heading: fields.text({ label: "Heading", defaultValue: "Kontakty" }),
        introText: fields.markdoc.inline({ label: "Intro Text (18px)" }),
        team: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            role: fields.text({ label: "Role" }),
            email: fields.text({ label: "Email" }),
            phone: fields.text({ label: "Phone" }),
            avatar: fields.image({
              label: "Profile Picture",
              directory: "src/assets/images/team",
              publicPath: "@/assets/images/team/",
            }),
            isFeatured: fields.checkbox({ label: "Featured Person" }),
          }),
          {
            label: "Team Members",
            itemLabel: (props) => props.fields.name.value,
          },
        ),
      },
    }),

    // Case Studies Section (4. Case Studies)
    caseStudies: singleton({
      label: "4. Case Studies",
      path: "src/content/sections/case-studies",
      format: { data: "json" },
      schema: {
        heading: fields.text({
          label: "Heading",
          defaultValue: "Případové studie",
        }),
        items: fields.array(
          fields.object({
            tabLabel: fields.text({ label: "Tab Label (e.g. SEVA)" }),
            heading: fields.text({ label: "Content Heading" }),
            description: fields.markdoc.inline({ label: "Description" }),
            image: fields.image({
              label: "Case Study Image",
              directory: "src/assets/images/case-studies",
              publicPath: "@/assets/images/case-studies/",
            }),
          }),
          {
            label: "Studies",
            itemLabel: (props) => props.fields.tabLabel.value,
          },
        ),
      },
    }),

    // Prefooter Section (6. Prefooter) - Only image is configurable
    prefooter: singleton({
      label: "6. Prefooter",
      path: "src/content/sections/prefooter",
      format: { data: "json" },
      schema: {
        image: fields.image({
          label: "Left Image",
          directory: "src/assets/images/prefooter",
          publicPath: "@/assets/images/prefooter/",
        }),
      },
    }),

    // Global Footer Configuration
    footer: singleton({
      label: "Patička",
      path: "src/content/global/footer",
      format: { data: "json" },
      schema: {
        company: fields.object(
          {
            name: fields.text({ label: "Company Name" }),
            street: fields.text({ label: "Street" }),
            city: fields.text({ label: "City" }),
          },
          { label: "Address" },
        ),
        legal: fields.object(
          {
            ico: fields.text({ label: "IČO" }),
            dic: fields.text({ label: "DIČ" }),
            court: fields.text({ label: "Court Registration" }),
          },
          { label: "Legal Info" },
        ),
        bank: fields.object(
          {
            accountNumber: fields.text({ label: "Account Number" }),
            swift: fields.text({ label: "SWIFT" }),
            iban: fields.text({ label: "IBAN" }),
          },
          { label: "Bank Details" },
        ),
        socials: fields.object(
          {
            facebook: fields.url({ label: "Facebook URL" }),
            instagram: fields.url({ label: "Instagram URL" }),
            x: fields.url({ label: "X (Twitter) URL" }),
            linkedin: fields.url({ label: "LinkedIn URL" }),
            youtube: fields.url({ label: "YouTube URL" }),
          },
          { label: "Social Media Links" },
        ),
      },
    }),
  },

  collections: {
    // Testimonials (Repeatable items)
    testimonials: collection({
      label: "Testimonials",
      slugField: "client",
      path: "src/content/testimonials/*",
      format: { data: "json" },
      schema: {
        client: fields.text({ label: "Client Name" }),
        quote: fields.text({ label: "Quote", multiline: true }),
        logo: fields.image({
          label: "Client Logo",
          directory: "src/assets/clients",
          publicPath: "@/assets/clients/",
        }),
      },
    }),
  },
});
