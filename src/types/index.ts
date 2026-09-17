export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category?: string;
  featured: boolean;
  stock: number;
  nicotine_strength?: string;
  flavor_profile?: string;
  createdAt: string;
  updatedAt: string;
  brand?: string;
  compareAtPrice?: number;
  inStock?: boolean;
  reviewCount?: number;
  puffCount?: number;
  volume?: string;
  rating?: number;
  imageUrl?: string;
  colorHex?: string;
  flavor?: string;
  flavors?: string | string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt: string;
  category?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Order {
  id: string;
  userId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedFlavor?: string;
}

export interface NewsletterSubscription {
  email: string;
}
