import { config, fields, singleton, collection } from "@keystatic/core";

export default config({
  storage: { kind: "local" },

  singletons: {
    // Global Footer Configuration
    footer: singleton({
      label: "Footer Info",
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

    // About Us Section (Benefits + Bio)
    about: singleton({
      label: "About Us",
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
