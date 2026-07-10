import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sunai_admin_session";

export async function getAdminPasswordHash(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || "sunai-admin";
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function checkPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.ADMIN_PASSWORD || "sunai-admin";
  return password === correctPassword;
}

export async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const correctToken = await getAdminPasswordHash();
  return token === correctToken;
}
