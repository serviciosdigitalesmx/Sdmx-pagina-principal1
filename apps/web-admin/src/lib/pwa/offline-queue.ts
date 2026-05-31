"use client";

type OfflineQueuedRequest = {
  id: string;
  tenantId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  createdAt: string;
};

const DB_NAME = "srfix-web-admin-pwa";
const DB_VERSION = 1;
const STORE_NAME = "offline-queue";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB no disponible"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB"));
    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDatabase();
  return await new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB error"));
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction error"));
  });
}

export async function enqueueOfflineRequest(input: Omit<OfflineQueuedRequest, "id" | "createdAt">) {
  const item: OfflineQueuedRequest = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };

  await withStore("readwrite", (store) => store.put(item));
  return item;
}

export async function listOfflineRequests(): Promise<OfflineQueuedRequest[]> {
  const items = await withStore("readonly", (store) => store.getAll());
  return Array.isArray(items) ? (items as OfflineQueuedRequest[]) : [];
}

export async function removeOfflineRequest(id: string) {
  await withStore("readwrite", (store) => store.delete(id));
}

export async function clearOfflineRequests() {
  await withStore("readwrite", (store) => store.clear());
}

export async function replayOfflineRequests(fetchToken: () => string) {
  const items = await listOfflineRequests();
  const failures: OfflineQueuedRequest[] = [];

  for (const item of items) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: {
          ...item.headers,
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: item.body ?? undefined,
      });

      if (!response.ok) {
        failures.push(item);
        continue;
      }

      await removeOfflineRequest(item.id);
    } catch {
      failures.push(item);
    }
  }

  return failures;
}

