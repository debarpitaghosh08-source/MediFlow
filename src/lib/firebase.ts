import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let app: any = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };

export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;
export const facebookProvider = isFirebaseConfigured ? new FacebookAuthProvider() : null;

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: "select_account" });
}
if (facebookProvider) {
  facebookProvider.setCustomParameters({ display: "popup" });
}

export function getRecaptchaVerifier() {
  if (typeof window === "undefined" || !isFirebaseConfigured || !auth) return null;

  const containerId = "recaptcha-container";
  let container = document.getElementById(containerId) as HTMLElement | null;
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.display = "none";
    document.body.appendChild(container);
  }

  const existingVerifier = (window as any).__mediflow_recaptcha;
  if (existingVerifier) {
    existingVerifier.clear();
  }

  const verifier = new RecaptchaVerifier(auth, container, {
    size: "invisible",
    callback: () => undefined,
  });

  (window as any).__mediflow_recaptcha = verifier;
  return verifier;
}

export async function signInWithGoogleFirebase() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error("Firebase is not configured. Add your Firebase credentials to .env.local.");
  }
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithFacebookFirebase() {
  if (!isFirebaseConfigured || !auth || !facebookProvider) {
    throw new Error("Firebase is not configured. Add your Firebase credentials to .env.local.");
  }
  return signInWithPopup(auth, facebookProvider);
}

export async function sendPhoneNumberOtp(phoneNumber: string): Promise<ConfirmationResult> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add your Firebase credentials to .env.local.");
  }
  if (typeof window === "undefined") {
    throw new Error("Phone auth can only be used in the browser.");
  }

  const verifier = getRecaptchaVerifier();
  if (!verifier) {
    throw new Error("Unable to initialize phone verification.");
  }

  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export function confirmPhoneOtp(confirmationResult: ConfirmationResult, otp: string) {
  return confirmationResult.confirm(otp);
}

export function clearRecaptchaVerifier() {
  if (typeof window === "undefined") return;
  const verifier = (window as any).__mediflow_recaptcha;
  if (verifier) {
    verifier.clear();
    delete (window as any).__mediflow_recaptcha;
  }
}
