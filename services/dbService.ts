
import { Entry } from '../types';

const DB_KEY = 'bullseye_vault_v1';

export const db = {
  getEntries: (): Entry[] => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Database read error:", e);
      return [];
    }
  },
  
  saveEntry: (entry: Entry): Entry[] => {
    const current = db.getEntries();
    const updated = [entry, ...current];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAll: () => {
    localStorage.removeItem(DB_KEY);
  }
};
