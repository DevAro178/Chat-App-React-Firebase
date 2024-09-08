import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5SNrcQvTuv5IdHVtPhzrRH9RJB3RaRDg",
  authDomain: "react-chat-app-828f8.firebaseapp.com",
  projectId: "react-chat-app-828f8",
  storageBucket: "react-chat-app-828f8.appspot.com",
  messagingSenderId: "190133880103",
  appId: "1:190133880103:web:c27c6071aa9639130c9502"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();