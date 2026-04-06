import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWx-7sjZuGOseiho9EG3sdxS5BCA1cz6c",
  authDomain: "algonest-16df7.firebaseapp.com",
  projectId: "algonest-16df7",
  storageBucket: "algonest-16df7.firebasestorage.app",
  messagingSenderId: "112495157363",
  appId: "1:112495157363:web:be9f48a5b5a61e4db30a06",
  measurementId: "G-W8MH2QK655",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
