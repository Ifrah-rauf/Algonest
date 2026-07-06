import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { supabase } from "../lib/supabase.js";
import bcrypt from "bcrypt";
const DEFAULT_ACCESS_TOKEN_TTL = "15m";
const DEFAULT_REFRESH_TOKEN_TTL = "30d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return secret || "algonest-dev-jwt-secret";
}

function buildTokenPayload(user, extras = {}) {
  return {
    uid: user.uid,
    username: user.username,
    email: user.email,
    role: user.role,
    ...extras,
  };
}

export function signAuthToken(user, options = {}) {
  const payload = buildTokenPayload(user, options.payload || {});
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: options.expiresIn || process.env.JWT_EXPIRES_IN || DEFAULT_ACCESS_TOKEN_TTL,
    ...(options.jwtId ? { jwtid: options.jwtId } : {}),
  });
}

export function signRefreshToken(user) {
  return {
    token: randomUUID(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  };
}

export async function storeRefreshToken({ uid, token, expiresAt }) {
  if (!uid || !token || !expiresAt) {
    throw new Error("uid, token, and expiresAt are required");
  }
   const hashedToken = await bcrypt.hash(token, 10);
  const { error } = await supabase.from("refresh_tokens").insert({
    uid,
    token: hashedToken,
    expires_at: expiresAt,
    revoked: false,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function revokeRefreshToken(rawToken) {
  if (!rawToken) return;

  const { data, error } = await supabase
    .from("refresh_tokens")
    .select("id, token");

  if (error || !data) throw new Error(error?.message || "No tokens found");

  for (const row of data) {
    const match = await bcrypt.compare(rawToken, row.token);
    if (match) {
      await supabase
        .from("refresh_tokens")
        .update({ revoked: true })
        .eq("id", row.id);
      return;
    }
  }
}


export async function isRefreshTokenValid(token) {
  if (!token) return false;

  const { data, error } = await supabase
    .from("refresh_tokens")
    .select("token, expires_at, revoked")
    .eq("revoked", false);

  if (error || !data || data.length === 0) return false;

  // Compare against all stored hashes
  for (const row of data) {
    const match = await bcrypt.compare(token, row.token);
    if (match) {
      if (!row.expires_at) return false;
      return new Date(row.expires_at) > new Date();
    }
  }

  return false;
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}
