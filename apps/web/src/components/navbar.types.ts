// Flat API response from /api/destinations
export interface ApiDestination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type?: "COUNTRY" | "REGION" | "PLACE";
  parentId?: number | null; // null = top-level country, number = child
  createdAt: string;
  updatedAt: string;
  trips?: any[];
}

// Hierarchical API response from /api/destinations/hierarchical
export interface ApiHierarchicalCountry {
  id: number;
  name: string;
  slug: string;
  destinations: {
    id: number;
    name: string;
    slug: string;
    tripCount: number;
  }[];
}

// Shape used by Navbar components
export interface NavDestination {
  title: string;
  path: string;
  secondLayer?: {
    title: string;
    path: string;
  }[];
}

export interface NavbarProps {
  navItems?: any[];
  destinationsData?: ApiDestination[];
  hierarchicalData?: ApiHierarchicalCountry[];
  categoriesData?: any[];
}

// Hardcoded fallback shown if API fails
export const defaultDestinations: NavDestination[] = [];
