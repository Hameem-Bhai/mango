/**
 * Mr. Mango BD — Centralized Store Configuration
 * All live store numbers, payment details, addresses, and domains.
 */

export const siteConfig = {
  name: 'Mr. Mango BD',
  shortName: 'Mr. Mango',
  tagline: 'Your favorite vape shop in BD',
  domain: 'https://mrmango.com',

  // Official Hotline & WhatsApp Contacts
  contact: {
    phone: '+880 1880-031355',
    phoneRaw: '+8801880031355',
    whatsapp: '8801880031355',
    whatsappFormatted: '+880 1880-031355',
    email: 'support@mrmango.com',
    emailBackup: 'mrmangobd@gmail.com',
  },

  // Physical Flagship Outlet in Dhaka
  outlet: {
    name: 'Mr. Mango Kuril Outlet',
    badge: 'Official Flagship Outlet',
    address: '2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka',
    shortAddress: 'Tong Market, Kuril (Beside AIUB Main Gate), Dhaka',
    hours: '11:00 AM – 11:00 PM (Open 7 Days)',
    hotline: '+880 1880-031355',
    whatsapp: '8801880031355',
    mapQuery: 'AIUB Main Gate, Kuril, Dhaka',
  },

  // Payment Options (bKash Payment & COD)
  payment: {
    bkash: {
      number: '01353219518',
      type: 'Payment', // bKash Payment (Make Payment option)
      instructions: [
        'Open your bKash App',
        'Tap on "Payment" (Make Payment)',
        'Enter Merchant Number: 01353219518',
        'Enter total order amount',
        'Use Order Number as reference',
        'Enter your bKash PIN to confirm',
        'Copy the TrxID and submit it below',
      ],
    },
    cod: {
      label: 'Cash on Delivery (COD)',
      dhakaDelivery: 'Same-day delivery inside Dhaka (৳60)',
      nationwideDelivery: '2-3 days delivery across all 64 districts in Bangladesh (৳120)',
    },
  },

  // Social & Developer Credits
  developer: {
    name: 'Hameem Bhai',
    studio: 'hameembhaierdokan.studio',
    url: 'https://hameembhaierdokan.studio',
  },
};
