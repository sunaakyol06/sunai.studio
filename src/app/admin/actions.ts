"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, getAdminPasswordHash, isAuthed } from "@/lib/auth";
import { saveStore, Store } from "@/lib/overrides";

export async function login(password: string) {
  const isValid = await checkPassword(password);
  if (!isValid) {
    return { error: "Geçersiz parola / Invalid password" };
  }

  const hash = await getAdminPasswordHash();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function persistStore(store: Store) {
  const authed = await isAuthed();
  if (!authed) {
    return { error: "Yetkisiz işlem / Unauthorized action" };
  }

  await saveStore(store);
  revalidatePath("/", "layout");
  return { success: true };
}
