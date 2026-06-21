export interface TCategoryVariantOptions {
  STOCK?: {
    label: string;
    options: string[];
  };
  COLORSPEC?: {
    label: string;
    options: string[];
  };
  "FINISH OPTIONS"?: {
    label: string;
    options: string[];
  };
}

export interface TCategory {
  category_id: string;

  created_at: string;
  updated_at: string;

  show_in_navbar: string;

  id: number;
  name: string;
  parent_id: number | null;
  category_description: string;
  category_image: string;
  variants: TCategoryVariantOptions;
  tags: string[];
  active: boolean;
  children: TCategory[]; // recursive for nested categories
}

export interface TCategoriesResponse {
  data: TCategory[];
  Message: string;
  isError: boolean;
  error: any;
  status_code: number;
  session_id: string;
}

// types/templateTypes.ts

// Top-level response from "get all templates" API
export interface TTemplatesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  traceId: string;
  data: TTemplatesData;
}

// Data wrapper (contains meta and array of templates)
export interface TTemplatesData {
  meta: TTemplatesMeta;
  data: TTemplate[];
}

// Single template object
export interface TTemplate {
  _id: string;
  category_name: string;
  category_id: string;
  slug: string;
  file_size: string;
  file_url: string;
  meta_data: Record<string, any>;
  createdAt: string; // ISO date string
  updatedAt: string;
  id: string;
}

// Pagination/meta info
export interface TTemplatesMeta {
  page: number;
  limit: number;
  total: number;
}
export interface UpdatedFile {
  _id: string;
  note: string | null;
  files: string[];       // array of file URLs
  order: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
// order
export interface TOrder {
  _id: string;
  user: string;
  delivery_address: string;
  order_id: string;
  note: string;
  shipping_method: string;
  order_type: string;
  products: Product[];
  status: string;
  sub_status: string;
  messages: string[];
  status_logs: string[];
  designer: Designer;
  printer: null;
  deliveryman: null;
  amount: number;
  tax: number;
  discount: number;
  total_payable_amount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  delivery_info: DeliveryInfo;
  project_name: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  type?: string;
  total_price: number;
  files: string[];
  updated_files?: UpdatedFile[];
}

export interface DeliveryInfo {
  _id: string;
  user: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  company: string;
  fax: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  local_address: string;
  coordinates: Coordinates;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Designer {
  id: number;
  name: string;
  email: string;
  role: string;
  user_id: string;
  profile_picture: null;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_type: string;
  category_id: number;
  category_name: string;
  files: string[];
  designer_files: any[];
  options: Options;
  digital_proof: boolean;
  digital_proof_price: number;
  job_sample: boolean;
  job_sample_price: number;
  shipping: string;
  shipping_method: string;
  project_name: string;
  turnaround_value: string;
  shipping_charge: number;
  turnaround_price: number;
  price: number;
  discount: number;
  quantity: number;
  tax: number;
  total: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Options {
  "Paper Type": string;
  Size: string;
  Corners: string;
  Sides: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface TSupportTicket {
  id: number;
  user_id: string;
  status: string;
  priority: string;
  attachment: null;
  created_at: Date;
  updated_at: Date;
  job_id: string;
  login_email: string;
  company_name: string;
  contact_name: string;
  contact_telephone: string;
  contact_email: string;
  problem_category: string;
  request_reprint: string;
  problem_description: string;
  user: null;
  replies: TReply[];
}

export interface TReply {
  id: number;
  support_ticket_id: string;
  admin_id: null;
  user_id: string;
  reply: string;
  reply_id: null;
  attachment: null | string;
  created_at: Date;
  updated_at: Date;
  user: null;
  admin: null;
}
