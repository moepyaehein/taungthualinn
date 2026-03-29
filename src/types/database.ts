/* ─── Enums ─── */
export type UserRole = 'farmer' | 'merchant' | 'admin';
export type PriceStatus = 'pending' | 'peer_verified' | 'admin_verified' | 'flagged' | 'rejected';
export type UploadStatus = 'pending' | 'approved' | 'rejected';
export type ListingType = 'buy' | 'sell';
export type ListingStatus = 'active' | 'paused' | 'fulfilled' | 'expired';
export type RiskLevel = 'high' | 'medium' | 'low';
export type BroadcastType = 'announcement' | 'warning' | 'emergency' | 'recommendation';
export type BroadcastTarget = 'all' | 'farmers' | 'merchants';
export type TrustLevel = 'trusted' | 'standard' | 'flagged' | 'suspended';
export type Quality = 'standard' | 'high' | 'low';
export type PriceUnit = 'basket' | 'viss' | 'ton';
export type UpdateFrequency = 'daily' | 'weekly';
export type Availability = 'immediate' | '1_week' | '2_weeks';
export type NotificationType = 'info' | 'warning' | 'emergency' | 'price' | 'system';

/* ─── Row types ─── */

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  region_id: number | null;
  phone: string | null;
  email: string | null;
  trust_level: TrustLevel;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface Region {
  id: number;
  name_mm: string;
  name_en: string;
}

export interface Market {
  id: number;
  name_mm: string;
  name_en: string | null;
  region_id: number;
}

export interface Category {
  id: number;
  name_mm: string;
  name_en: string | null;
  sort_order: number;
}

export interface Product {
  id: number;
  name_mm: string;
  name_en: string | null;
  category_id: number;
  sort_order: number;
}

export interface PriceSubmission {
  id: number;
  merchant_id: string;
  product_id: number;
  market_id: number;
  buy_price: number;
  sell_price: number;
  unit: PriceUnit;
  quality: Quality;
  frequency: UpdateFrequency;
  status: PriceStatus;
  notes: string | null;
  comparison_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface BulkUpload {
  id: number;
  merchant_id: string;
  filename: string;
  row_count: number;
  error_count: number;
  status: UploadStatus;
  created_at: string;
}

export interface Listing {
  id: number;
  merchant_id: string;
  type: ListingType;
  product_id: number;
  quantity: number;
  quantity_unit: string;
  target_price: number;
  region_id: number;
  availability: Availability;
  is_emergency: boolean;
  pickup_available: boolean;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface Emergency {
  id: number;
  title: string;
  description: string;
  region_id: number;
  risk_level: RiskLevel;
  affected_farmers: number;
  affected_merchants: number;
  crop_damage_estimate: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string;
}

export interface Broadcast {
  id: number;
  type: BroadcastType;
  target: BroadcastTarget;
  region_id: number | null;
  content: string;
  created_by: string;
  created_at: string;
}

export interface FarmerRecord {
  id: number;
  farmer_id: string;
  product_id: number;
  harvest_qty: number | null;
  storage_qty: number | null;
  sale_date: string | null;
  sale_price: number | null;
  total_amount: number | null;
  created_at: string;
}

export interface PeerVerification {
  id: number;
  price_submission_id: number;
  verifier_id: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  type: NotificationType;
  link: string | null;
  created_at: string;
}

/* ─── Joined / extended types used by API responses ─── */

export interface PriceSubmissionWithRelations extends PriceSubmission {
  merchant?: Pick<Profile, 'id' | 'full_name' | 'trust_level'>;
  product?: Pick<Product, 'id' | 'name_mm' | 'category_id'>;
  market?: Pick<Market, 'id' | 'name_mm' | 'region_id'>;
  peer_verifications?: PeerVerification[];
}

export interface ListingWithRelations extends Listing {
  merchant?: Pick<Profile, 'id' | 'full_name'>;
  product?: Pick<Product, 'id' | 'name_mm'>;
  region?: Pick<Region, 'id' | 'name_mm'>;
}

export interface EmergencyWithRegion extends Emergency {
  region?: Pick<Region, 'id' | 'name_mm'>;
}

export interface FarmerRecordWithProduct extends FarmerRecord {
  product?: Pick<Product, 'id' | 'name_mm'>;
}

/* ─── Supabase Database type (for generic client typing) ─── */

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; full_name: string; role: UserRole }; Update: Partial<Profile> };
      regions: { Row: Region; Insert: Omit<Region, 'id'>; Update: Partial<Omit<Region, 'id'>> };
      markets: { Row: Market; Insert: Omit<Market, 'id'>; Update: Partial<Omit<Market, 'id'>> };
      categories: { Row: Category; Insert: Omit<Category, 'id'>; Update: Partial<Omit<Category, 'id'>> };
      products: { Row: Product; Insert: Omit<Product, 'id'>; Update: Partial<Omit<Product, 'id'>> };
      price_submissions: { Row: PriceSubmission; Insert: Omit<PriceSubmission, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<PriceSubmission, 'id'>> };
      bulk_uploads: { Row: BulkUpload; Insert: Omit<BulkUpload, 'id' | 'created_at'>; Update: Partial<Omit<BulkUpload, 'id'>> };
      listings: { Row: Listing; Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Listing, 'id'>> };
      emergencies: { Row: Emergency; Insert: Omit<Emergency, 'id' | 'created_at'>; Update: Partial<Omit<Emergency, 'id'>> };
      broadcasts: { Row: Broadcast; Insert: Omit<Broadcast, 'id' | 'created_at'>; Update: Partial<Omit<Broadcast, 'id'>> };
      farmer_records: { Row: FarmerRecord; Insert: Omit<FarmerRecord, 'id' | 'created_at'>; Update: Partial<Omit<FarmerRecord, 'id'>> };
      peer_verifications: { Row: PeerVerification; Insert: Omit<PeerVerification, 'id' | 'created_at'>; Update: Partial<Omit<PeerVerification, 'id'>> };
      audit_log: { Row: AuditLog; Insert: Omit<AuditLog, 'id' | 'created_at'>; Update: Partial<Omit<AuditLog, 'id'>> };
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Omit<Notification, 'id'>> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
