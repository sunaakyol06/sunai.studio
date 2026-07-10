import fs from "fs";
import path from "path";
import { Store, getDefaultSettings } from "./types";

export * from "./types";

const STORE_KEY = "sunai:store";
const LOCAL_STORE_PATH = path.join(process.cwd(), "src/data/store.json");

function getLocalStore(): Store {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORE_PATH, "utf8");
      return normalize(JSON.parse(data));
    }
  } catch (error) {
    console.error("Failed to read local store:", error);
  }
  return { overrides: {}, custom: [], settings: getDefaultSettings() };
}

function saveLocalStore(store: Store) {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write local store:", error);
  }
}

function normalize(store: any): Store {
  return {
    overrides: store?.overrides || {},
    custom: store?.custom || [],
    settings: store?.settings || getDefaultSettings()
  };
}

export async function getStore(): Promise<Store> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url}/get/${STORE_KEY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          return normalize(JSON.parse(json.result));
        }
      }
    } catch (error) {
      console.error("Failed to fetch store from Upstash KV:", error);
    }
  }

  return getLocalStore();
}

export async function saveStore(store: Store): Promise<void> {
  const normalizedStore = normalize(store);
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url}/set/${STORE_KEY}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(normalizedStore)
      });
      if (res.ok) {
        return;
      }
    } catch (error) {
      console.error("Failed to save store to Upstash KV:", error);
    }
  }

  saveLocalStore(normalizedStore);
}

export function applyOrderAndHidden<T extends { id: string }>(
  items: T[],
  override?: any
): T[] {
  if (!override) return items;

  const { hidden = [], order = [] } = override;

  let result = items.filter((item) => !hidden.includes(item.id));

  if (order.length > 0) {
    result.sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return 0;
    });
  }

  return result;
}
