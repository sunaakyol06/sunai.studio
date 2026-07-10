import { isAuthed } from "@/lib/auth";
import { getStore } from "@/lib/overrides";
import LoginForm from "./LoginForm";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthed();

  if (!authed) {
    return <LoginForm />;
  }

  const store = await getStore();

  return <AdminEditor initialStore={store} />;
}
