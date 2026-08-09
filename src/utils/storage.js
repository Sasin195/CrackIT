const STORAGE_KEY = "dsaAppData";

export const DEFAULT_DATA = {
  progress: {},
  notes: {},
  reviews: {},
  days: {},
  streak: {
    current: 0,
    longest: 0,
    lastCompletedDate: null
  },
  simulations: [],
  settings: {
    theme: "system"
  },
  planCompletedAt: null,
  todayCompleted: null,
  _meta: {
    lastModifiedAt: null
  }
};

export function normalizeData(parsed) {
  return {
    ...structuredClone(DEFAULT_DATA),
    ...parsed,
    progress: { ...(parsed.progress || {}) },
    notes: { ...(parsed.notes || {}) },
    reviews: { ...(parsed.reviews || {}) },
    days: { ...(parsed.days || {}) },
    simulations: Array.isArray(parsed.simulations) ? parsed.simulations : [],
    streak: { ...structuredClone(DEFAULT_DATA.streak), ...(parsed.streak || {}) },
    settings: { ...structuredClone(DEFAULT_DATA.settings), ...(parsed.settings || {}) },
    todayCompleted: parsed.todayCompleted || null
  };
}

export function getAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    return normalizeData(JSON.parse(raw));
  } catch (err) {
    console.error("Failed to read app data:", err);
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save app data:", err);
  }
}
