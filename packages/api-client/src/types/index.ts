export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface User {
  id: number;
  email: string;
  userName: string;
  role: string;
  avatar?: Media;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trip {
  id: number;
  title: string;
  slug: string;
  description: string;
  overview?: string;
  duration?: number;
  maxAltitude?: number;
  groupSizeMin?: number;
  groupSizeMax?: number;
  price: string;
  basePriceUSD?: string;
  bestSeason?: string;
  status: string;
  tripCode?: string;
  region?: string;
  featured?: boolean;
  category?: TripCategory;
  specialityOrder?: number;
  packageOrder?: number;
  difficulty?: string;
  createdAt: string;
  updatedAt: string;
  media?: TripMedia[];
  itineraries?: any[]; // details left generic for now
  itineraryDays?: any[]; // Keep generic for now or match type
  inclusions?: Inclusion[];
  exclusions?: Exclusion[];
  reviews?: Review[];
  destinations?: TripDestination[];
  faqs?: FAQItem[];

  // Add map-related fields
  mapUrl?: string;
  mapTitle?: string;
  mapDescription?: string;
  location?: {
    coordinates?: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface TripDestination {
  id: number;
  tripId: number;
  destinationId: number;
  destination: Destination;
}

export interface Inclusion {
  id: number;
  tripId: number;
  description: string;
}

export interface Exclusion {
  id: number;
  tripId: number;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface TripMedia {
  id: number;
  url: string;
  type: string;
  isThumbnail: boolean;
  media: Media;
  role?: string;
}

export interface TripQuery {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  difficulty?: string;
  durationMin?: number;
  durationMax?: number;
  priceMin?: number;
  priceMax?: number;
  isSpeciality?: boolean;
  isPackage?: boolean;
  category?: TripCategory;
  specialityOrder?: number;
  packageOrder?: number;
  ids?: number[] | string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  published: boolean;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: Author;
  tags?: Tag[];
  views?: number;
  likes?: number;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type?: "COUNTRY" | "REGION" | "PLACE";
  parentId?: number;
  parent?: Destination;
  createdAt: string;
  updatedAt: string;
  tripCount: number;
  trips?: { trip: Trip }[];
}

export interface HierarchicalDestination {
  id: number;
  name: string;
  slug: string;
  image?: string;
  tripCount?: number;
  destinations?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export interface HierarchicalCountry {
  id: number;
  name: string;
  slug: string;
  destinations: HierarchicalDestination[];
}

export interface CreateBookingDto {
  tripId: number;
  departureId?: number;
  preferredDate?: string;
  numberOfPeople: number;

  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  leadSource?: string;
  message?: string;

  // Optional frontend-specific fields if needed, but matched to backend
  countryCode?: string;
  paymentMethod?: string;
  discountCode?: string;
}

export interface CreateInquiryDto {
  tripId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  numberOfPeople: number;
  preferredDate?: string;
  message?: string;
}

export interface BookingResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  leadSource?: string;
  bookingStatus: string;
  tripId: number;
  departureId?: number;
  preferredDate?: string;
  numberOfPeople: number;
  message?: string;
  adminNotes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  status: string;
  trip: Trip;
}

export interface InquiryResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  numberOfPeople: number;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  message?: string;
  preferredDate?: string;
  status: string;
  tripId: number;
  trip: Trip;
}

export interface Departure {
  id: number;
  createdAt: string;
  updatedAt: string;
  tripId: number;
  startDate: string;
  endDate?: string;
  availableSeats: number;
  totalSeats: number;
  status: DepartureStatus;
  guide?: string;
  trip?: Trip;
}

export enum DepartureStatus {
  OPEN = "OPEN",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface DepartureQuery {
  page?: number;
  limit?: number;
  tripId?: number;
  status?: DepartureStatus;
  startDateFrom?: string;
  startDateTo?: string;
}
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface LoginCredentials {
  userName: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
}

export interface ICountry {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  gallery: string;
  metatitle: string;
  metakey: string;
  metadisc: string;
  created_at: string;
  updated_at: string;
  blend: null;
  template: string;
  country_contents: ICountryContent[];
  trips: Trip[];
}

export interface ICountryContent {
  id: number;
  country_id: number;
  content_type: string;
  title: string;
  content: string;
  action_lable: string;
  action_link: string;
  image: string;
  order: number;
}

export interface IPackage {
  id: number;
  title: string;
  slug: string;
  description: string;
  overview?: string;
  duration?: number;
  maxAltitude?: number;
  groupSizeMin?: number;
  groupSizeMax?: number;
  price?: string;
  status: string;
  tripCode?: string;
  region?: string;
  featured?: boolean;
  difficulty?: string;
  createdAt: string;
  updatedAt: string;

  // Media
  image?: string;
  gallery?: string[];
  media?: TripMedia[];

  // Content sections
  trip_highlights?: string;
  accommodation?: string;
  packing_lists?: string;

  // Includes/Excludes
  includes?: Inclusion[];
  excludes?: Exclusion[];

  // Itinerary
  itinerary?: ItineraryDay[];
  short_itinerary?: ShortItineraryItem[];

  // Reviews
  rating?: number;
  review_count?: number;
  reviews?: Review[];

  // Related content
  relatedtours?: Trip[];
  relatedreads?: Blog[];
}

export interface ItineraryDay {
  id: number;
  day: number;
  title: string;
  description: string;
  image?: string;
  accommodations?: string;
  meals?: string;
  activities?: string;
}

export interface ShortItineraryItem {
  id: number;
  day: number;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  reviewerName: string;
  reviewerEmail?: string;
  reviewerCountry?: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
  user?: {
    userName?: string;
    email?: string;
  };
}

export interface Media {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  folder?: string;
  s3Key?: string;
  s3Bucket?: string;
  displayOrder: number;
  videoDuration?: number;
  uploadedBy?: number;
  user?: {
    id: number;
    userName: string;
    email: string;
  };
}

export type MediaResponse = ApiResponse<Media[]>;

export interface MediaQuery {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
  type?: "IMAGE" | "VIDEO";
}

export interface FolderStats {
  name: string;
  count: number;
}

export enum TripCategory {
  TREKKING = "TREKKING",
  PEAK_CLIMBING = "PEAK_CLIMBING",
  CULTURAL_HERITAGE = "CULTURAL_HERITAGE",
  ADVENTURE_SPORTS = "ADVENTURE_SPORTS",
  SCENIC_ADVENTURES = "SCENIC_ADVENTURES",
  WILDLIFE_SAFARIS = "WILDLIFE_SAFARIS",
  PILGRIMAGE = "PILGRIMAGE",
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export enum NavbarItemType {
  LINK = "LINK",
  DYNAMIC_DESTINATIONS = "DYNAMIC_DESTINATIONS",
  DYNAMIC_TOURS = "DYNAMIC_TOURS",
}

export interface NavbarItem {
  id: number;
  title: string;
  path?: string;
  type: NavbarItemType;
  order: number;
  parentId?: number | null;
  children?: NavbarItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NavbarItemDto {
  id?: number;
  title: string;
  path?: string;
  type?: NavbarItemType;
  order?: number;
  parentId?: number;
  children?: NavbarItemDto[];
}

export interface AvailableRoute {
  label: string;
  path: string;
  group: string;
}

export interface CategoryMetadata {
  slug: string;
  label: string;
  value: string;
}

export interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeTrips: number;
}

export interface DashboardActivity {
  recentInquiries: InquiryResponse[];
  recentBookings: BookingResponse[];
}

export interface DashboardChartData {
  name: string;
  bookings: number;
  confirmed: number;
}
