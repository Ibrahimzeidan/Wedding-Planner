import type { UserRole } from "@/lib/auth";

export type AccountUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  profile_image?: string | null;
};

export type AccountProfile = Record<string, string | number | null | object>;

export type AccountData = {
  user: AccountUser;
  profile: AccountProfile;
  role: UserRole;
};

export type AccountResponse = {
  success: boolean;
  message: string;
  data: AccountData;
};

export type PasswordPayload = {
  current_password: string;
  new_password: string;
};
