export interface TrainOrderDetails {
  statusCode: number;
  success: boolean;
  message: string;
  traceId: string;
  data: Data;
}

export interface Data {
  _id: string;
  user: User;
  delivery_address: DeliveryAddress;
  order_id: string;
  note: string;
  shipping_method: string;
  order_type: string;
  products: Product[];
  status: string;
  sub_status: string;
  messages: string[];
  status_logs: StatusLog[];
  designer: Designer;
  printer: null;
  deliveryman: null;
  amount: number;
  tax: number;
  discount: number;
  total_payable_amount: number;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export interface DeliveryAddress {
  coordinates: Coordinates;
  label: string;
  type: string;
  is_default: boolean;
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
  createdAt: Date;
  updatedAt: Date;
  id: string;
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
  id: string;
}

export interface Options {
  "Paper Type": string;
  Size: string;
  Corners: string;
  Sides: string;
}

export interface StatusLog {
  _id: string;
  order: string;
  action_by: User;
  status: string;
  sub_status: null | string;
  action_at: Date;
  sub_action_at: Date;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  user_id?: string;
  profile_picture: null | string;
  _id?: string;
}