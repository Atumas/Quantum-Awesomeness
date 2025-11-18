export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  github: string;
  downloads: number;
  rating: number;
  cost: 'free' | 'premium';
}

export const TEMPLATE_MARKETPLACE: TemplateDefinition[] = [
  {
    id: 'saas-boilerplate',
    name: 'SaaS Starter',
    description: 'Full SaaS with auth, billing, dashboard',
    github: 'appforge/templates/saas',
    downloads: 15420,
    rating: 4.9,
    cost: 'free',
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot',
    description: 'ChatGPT-style interface with streaming',
    github: 'appforge/templates/chatbot',
    downloads: 8932,
    rating: 4.8,
    cost: 'free',
  },
  {
    id: 'ecommerce-pro',
    name: 'E-Commerce Pro',
    description: 'Stripe, inventory, admin panel',
    github: 'appforge/templates/ecommerce',
    downloads: 12450,
    rating: 4.7,
    cost: 'premium',
  },
  {
    id: 'portfolio-3d',
    name: '3D Portfolio',
    description: 'Three.js + Framer Motion showcase',
    github: 'appforge/templates/portfolio-3d',
    downloads: 6789,
    rating: 4.9,
    cost: 'free',
  },
  {
    id: 'social-network',
    name: 'Social Network',
    description: 'Posts, likes, follows, real-time feed',
    github: 'appforge/templates/social',
    downloads: 9102,
    rating: 4.6,
    cost: 'premium',
  },
];
