import { useSyncExternalStore } from "react";
const NS = "nexus-hr:v1:";
const listeners = /* @__PURE__ */ new Map();
function emit(key) {
  listeners.get(key)?.forEach((l) => l());
}
function subscribe(key, l) {
  let set = listeners.get(key);
  if (!set) {
    set = /* @__PURE__ */ new Set();
    listeners.set(key, set);
  }
  set.add(l);
  return () => set.delete(l);
}
const cache = /* @__PURE__ */ new Map();
function readStore(key, initial) {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(NS + key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) return cached.value;
    const value = raw ? JSON.parse(raw) : initial;
    cache.set(key, { raw, value });
    return value;
  } catch {
    return initial;
  }
}
function writeStore(key, value) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(value);
  window.localStorage.setItem(NS + key, raw);
  cache.set(key, { raw, value });
  emit(key);
}
function updateStore(key, initial, updater) {
  const next = updater(readStore(key, initial));
  writeStore(key, next);
  return next;
}
function useStore(key, initial) {
  const value = useSyncExternalStore(
    (l) => subscribe(key, l),
    () => readStore(key, initial),
    () => initial
  );
  const setValue = (v) => {
    const next = typeof v === "function" ? v(readStore(key, initial)) : v;
    writeStore(key, next);
  };
  return [value, setValue];
}
function resetStore() {
  if (typeof window === "undefined") return;
  const keysToRemove = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(NS)) keysToRemove.push(k);
  }
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  cache.clear();
  listeners.forEach((set) => set.forEach((l) => l()));
}
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
export {
  readStore,
  resetStore,
  uid,
  updateStore,
  useStore,
  writeStore
};
