export interface ContactInfo {
  /** Shown on the site, e.g. "+962 77 894 7384" */
  phoneDisplay: string;
  /** Digits only with country code, used for tel: links, e.g. "962778947384" */
  phone: string;
  /** Digits only with country code, used for wa.me links */
  whatsapp: string;
  email: string;
  locationText: string;
  mapUrl: string;
  /** رقم السجل التجاري, shown in the footer */
  commercialRegistration: string;
}

export type CategoryKey = 'networks' | 'cameras' | 'intercom';

export interface ServiceItem {
  id: string;
  title: string;
  /** Pill at the top of the card, e.g. "150 ريال" or "معاينة وعرض سعر" */
  badge: string;
  /** 'price' = green monospace pill, 'info' = blue pill */
  badgeTone: 'price' | 'info';
  /** Small grey text next to the badge */
  sideNote: string;
  description: string;
  /** Box under the description. **text** = bold, !!text!! = green bold, lines starting with "• " = bullets */
  details: string;
  /** Optional small footnote inside the details box */
  detailsNote: string;
  /** 'plain' = white box, 'info' = light-blue box */
  detailsTone: 'plain' | 'info';
  buttonLabel: string;
}

export interface ServiceCategory {
  key: CategoryKey;
  /** Department name used by the booking form, e.g. "الشبكات" */
  name: string;
  cardTitle: string;
  cardDescription: string;
  cardImage: string;
  cardLinkLabel: string;
  filterLabel: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  items: ServiceItem[];
}

export type GalleryCategory = 'networks' | 'cameras' | 'intercom' | 'wifi';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  location: string;
  date: string;
  description: string;
  gradient: string;
  iconSymbol: string;
  badge: string;
  image?: string;
}

export interface HeroHighlight {
  id: string;
  text: string;
}

export interface HeroContent {
  titleLine1: string;
  /** Second line, shown in blue */
  titleLine2: string;
  subtitle: string;
  /** Short selling points under the buttons, e.g. "معاينة مجانية للموقع" */
  highlights: HeroHighlight[];
  /** Uploaded photo beside the headline; empty = the built-in device illustration */
  image?: string;
}

/** Department names understood by the booking form */
export type OfferCategory = 'الشبكات' | 'كاميرات المراقبة' | 'الإنتركوم' | 'باقات متكاملة';

export interface Offer {
  id: string;
  title: string;
  category: OfferCategory;
  /** Optional ribbon, e.g. "الأكثر طلبًا" */
  badge: string;
  /** Shown big, e.g. "1,200 ريال" */
  price: string;
  /** Optional crossed-out previous price */
  oldPrice: string;
  description: string;
  /** What the offer includes, one item per entry */
  includes: string[];
  /** Small print under the list, e.g. "السعر لا يشمل..." */
  note: string;
  /** Highlighted with a blue border */
  featured: boolean;
}

export interface ServicePackage {
  id: string;
  title: string;
  /** Who it's for, e.g. "الفلل السكنية" */
  target: string;
  /** Optional ribbon, e.g. "الأكثر طلبًا" */
  badge: string;
  /** Shown big, e.g. "4,500 ريال" */
  price: string;
  /** Optional crossed-out previous price */
  oldPrice: string;
  description: string;
  /** What the package includes, one item per entry */
  includes: string[];
  /** Small print under the list, e.g. "ضمان سنتين على الأجهزة" */
  note: string;
  /** Highlighted with a blue border */
  featured: boolean;
  /** Optional photo at the top of the card */
  image?: string;
  /**
   * Set (even empty) = a group package that branches into these options; the group's own
   * fields become the shared header and `price` reads as "starting from".
   * Missing = a single package.
   */
  subPackages?: SubPackage[];
}

/** One priced option inside a group package, e.g. "الأساسية" / "المتقدمة" */
export interface SubPackage {
  id: string;
  title: string;
  /** Optional ribbon, e.g. "الأكثر طلبًا" */
  badge: string;
  price: string;
  oldPrice: string;
  description: string;
  /** What this option includes on top of the group's shared list */
  includes: string[];
  /** Highlighted as the recommended option */
  featured: boolean;
  /** Optional photo at the top of the option's card */
  image?: string;
}

export interface SiteContent {
  contact: ContactInfo;
  services: ServiceCategory[];
  gallery: GalleryItem[];
  offers: Offer[];
  packages: ServicePackage[];
  hero: HeroContent;
}

export type ContentKey = keyof SiteContent;
