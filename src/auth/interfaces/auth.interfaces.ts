// Interface for JWT payload used in authentication
export interface JwtPayload {
  sub: number; // Subject (the user ID)
  email: string; // User email
  role: string; // User role
  iat?: number; // Issued at time (optional)
  exp?: number; // Expiration time (optional)
}
