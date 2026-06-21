// src/types/admin.ts
export interface Admin {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "admin" | "moderator" | "client" | "deliveryman" | "printer" | "designer" | "super_admin";
  status: boolean | "active" | "inactive";
  work_place: string;
  phone_number?: string;
  driving_license?: string;
  password?: string;
  password_confirmation?: string;
  date_of_birth?: string; // ISO string, e.g., "1990-01-15"
  gender?: "male" | "female" | "other";
  profile_picture?: string | null;
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp

  // Optional API response fields
  isError?: boolean;       // true if API returned an error
  Message?: string;        // success or info message
  success?: boolean;
  message?: string;
  error?: {
    code?: number;
    message?: string;
    errMsg?: string;
  };
}
