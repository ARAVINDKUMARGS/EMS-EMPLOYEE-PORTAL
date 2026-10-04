function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      console.warn("[WARN] JWT_SECRET environment variable is not defined in Vercel settings. Using default fallback key.");
    }
    return "super_secret_jwt_key_nexus_hr_2026";
  }
  return secret;
}

module.exports = getJwtSecret;
