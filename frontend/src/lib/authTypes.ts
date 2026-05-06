export type UserRole = "customer" | "service_provider" | "admin";

export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};
