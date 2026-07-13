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

function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;

  const output = { ...target };
  
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (sourceVal && typeof sourceVal === "object" && !Array.isArray(sourceVal)) {
      output[key] = deepMerge(targetVal || {}, sourceVal);
    } else if (targetVal === undefined) {
      output[key] = sourceVal;
    }
  }
  return output;
}

function normalize(store: any): Store {
  const defaultSettings = getDefaultSettings();
  const normalizedSettings = store?.settings ? deepMerge(store.settings, defaultSettings) : defaultSettings;

  return {
    overrides: store?.overrides || {},
    custom: store?.custom || [],
    settings: normalizedSettings
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
          const parsed = JSON.parse(json.result);
          console.log("Loaded store from Upstash KV. settings.hero:", parsed?.settings?.hero);
          return normalize(parsed);
        }
      } else {
        console.error("Upstash KV get failed with status:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch store from Upstash KV:", error);
    }
  }

  console.log("KV not configured or failed, loading local store");
  return getLocalStore();
}

export async function saveStore(store: Store): Promise<void> {
  const normalizedStore = normalize(store);
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  console.log("Saving store. settings.hero:", normalizedStore.settings?.hero);

  // Synchronize uploads.json with custom cover image and uploaded media
  try {
    const uploadsFilePath = path.join(process.cwd(), "src/data/uploads.json");
    const uploadsJson: Record<string, { media: any[]; coverImage?: string }> = {};

    for (const slug of Object.keys(normalizedStore.overrides)) {
      const override = normalizedStore.overrides[slug];
      if (override.added?.length || override.coverImage) {
        uploadsJson[slug] = {
          media: (override.added || []).map(m => ({
            type: m.type,
            src: m.src,
            poster: m.poster,
            ratio: m.ratio,
            title: m.title
          })),
          coverImage: override.coverImage
        };
      }
    }

    fs.writeFileSync(uploadsFilePath, JSON.stringify(uploadsJson, null, 2), "utf8");
    console.log("Successfully synchronized uploads.json");
  } catch (err) {
    console.error("Failed to write uploads.json:", err);
  }

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
        console.log("Successfully saved store to Upstash KV");
        return;
      } else {
        const errorText = await res.text();
        console.error("Upstash KV set failed with status:", res.status, errorText);
        throw new Error(`Upstash KV set failed: ${res.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to save store to Upstash KV:", error);
      throw error;
    }
  }

  console.log("KV not configured, saving to local store");
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(normalizedStore, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write local store:", error);
    throw new Error(`Local store write failed: ${error instanceof Error ? error.message : String(error)}`);
  }
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
