import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJ_ihEyLn3bp2v-yH-z6-1-5EdRHabHGU",
  authDomain: "medlink-4a4fd.firebaseapp.com",
  projectId: "medlink-4a4fd",
  storageBucket: "medlink-4a4fd.firebasestorage.app",
  messagingSenderId: "231645471951",
  appId: "1:231645471951:web:61d23613034e6832bc03ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
