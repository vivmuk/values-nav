
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { Entry } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu6oc0pN5jSWZkczynX53PuGgiBO_K0FQ",
  authDomain: "values-navigator.firebaseapp.com",
  projectId: "values-navigator",
  storageBucket: "values-navigator.firebasestorage.app",
  messagingSenderId: "311025761914",
  appId: "1:311025761914:web:d6fdb81c1be45ede2645c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION_NAME = "assessments";

export const cloudService = {
  /**
   * Fetches all value assessments from live Firestore, ordered by most recent.
   */
  async getHistory(): Promise<Entry[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Use Firestore's unique ID
      })) as Entry[];
    } catch (error) {
      console.error("Error fetching from Firestore:", error);
      return [];
    }
  },

  /**
   * Saves a new assessment to the live Firestore 'assessments' collection.
   */
  async syncEntry(entry: Entry): Promise<void> {
    try {
      // Remove local ID to let Firestore generate its own, or keep it if preferred
      await addDoc(collection(db, COLLECTION_NAME), entry);
    } catch (error) {
      console.error("Error syncing to Firestore:", error);
      throw error;
    }
  },

  /**
   * Note: Purge functionality is restricted in Firestore for safety.
   * You would typically delete documents individually via their IDs.
   */
  async purgeHistory(): Promise<void> {
    console.warn("Purge requested. In Firestore, this requires deleting a collection via the console or a batch script.");
  }
};
