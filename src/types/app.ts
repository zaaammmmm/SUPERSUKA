export type AuthProvider = "firebase" | "supabase";
export type AppStatus = "active" | "maintenance";

export interface App {
  id: string;
  name: string;
  description: string;
  href: string;
  category: string;
  status: AppStatus;
  authProvider: AuthProvider;
  externalUrl: string;
}
