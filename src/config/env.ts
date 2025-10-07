// Environment configuration
// Note: 
// - Local development: http://localhost:8081/api
// - Production: https://geneology-web-be.onrender.com/api
// - API endpoints will automatically append /relations when needed (e.g., /relations/trees/{treeId}/root)
export const env = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://geneology-web-be-167p.onrender.com/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "React Project Structure",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
} as const;

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
