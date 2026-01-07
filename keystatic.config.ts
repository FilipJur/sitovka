import { config, fields, singleton, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  
  singletons: {
    // Global Footer Configuration
    footer: singleton({
      label: 'Footer Info',
      path: 'src/content/global/footer',
      format: { data: 'json' },
      schema: {
        company: fields.object({
          name: fields.text({ label: 'Company Name' }),
          street: fields.text({ label: 'Street' }),
          city: fields.text({ label: 'City' }),
        }, { label: 'Address' }),
        legal: fields.object({
          ico: fields.text({ label: 'IČO' }),
          dic: fields.text({ label: 'DIČ' }),
          court: fields.text({ label: 'Court Registration' }),
        }, { label: 'Legal Info' }),
        bank: fields.object({
          accountNumber: fields.text({ label: 'Account Number' }),
          swift: fields.text({ label: 'SWIFT' }),
          iban: fields.text({ label: 'IBAN' }),
        }, { label: 'Bank Details' }),
        socials: fields.object({
          facebook: fields.url({ label: 'Facebook URL' }),
          instagram: fields.url({ label: 'Instagram URL' }),
          x: fields.url({ label: 'X (Twitter) URL' }),
          linkedin: fields.url({ label: 'LinkedIn URL' }),
          youtube: fields.url({ label: 'YouTube URL' }),
        }, { label: 'Social Media Links' }),
      },
    }),

    // Homepage Content
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        heroHeadline: fields.text({ label: 'Hero Headline' }),
      }
    }),
  },

  collections: {
    // Testimonials (Repeatable items)
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'client',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      schema: {
        client: fields.text({ label: 'Client Name' }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        logo: fields.image({ 
            label: 'Client Logo',
            directory: 'src/assets/clients',
            publicPath: '@/assets/clients/'
        }),
      }
    })
  }
});