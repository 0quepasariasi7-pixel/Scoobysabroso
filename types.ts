export interface ChurrascoItem {
    name: string;
    description: string;
    price: string;
    image?: string;
}

export interface DrinkOption {
    name: string;
    price: string;
}

export interface DrinkItem {
    name: string;
    description: string;
    options: DrinkOption[];
    image?: string;
}

export interface ExtraItem {
    name: string;
    price: string;
}

export interface FajitaProtein {
    name: string;
}

export interface FajitaAccompaniment {
    name: string;
}

export interface FajitaOption {
    name: string;
    price: string;
}

export interface FajitaCategory {
    name: string;
    description: string;
    options: FajitaOption[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface OrderItem {
    name: string;
    price: string;
}

export interface FinalizedOrder {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  total: string;
}

export interface PartialOrder {
    itemName: string;
    price: string;
    details: string;
}

export interface CustomPageItem {
    name: string;
    description: string;
    price: string;
    image?: string;
}

export interface CustomPage {
    enabled: boolean;
    title: string;
    items: CustomPageItem[];
}

export interface SalsaItem {
    name: string;
}

export interface Socials {
    instagram?: string;
    tiktok?: string;
    instagramIcon?: string;
    tiktokIcon?: string;
}

export interface MenuData {
    churrascos: ChurrascoItem[];
    extras: ExtraItem[];
    fajitas: {
        proteins: FajitaProtein[];
        accompaniments: FajitaAccompaniment[];
        categories: FajitaCategory[];
    };
    drinks: DrinkItem[];
    salsas: SalsaItem[];
    socials?: Socials;
    customPages: CustomPage[];
}