function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      console.error("[CRITICAL CONFIG ERROR] JWT_SECRET environment variable is missing in Vercel settings!");
      throw new Error("Server Configuration Error: JWT_SECRET environment variable is missing.");
    }
    console.warn("[WARN] JWT_SECRET environment variable is missing. Using development fallback key.");
    return "super_secret_jwt_key_nexus_hr_2026";
  }
  return secret;
}

module.exports = getJwtSecret;
