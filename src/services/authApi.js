import {
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const REDIRECT_FALLBACK_ERROR_CODES = new Set([
  "auth/popup-blocked",
  "auth/cancelled-popup-request",
]);

export const loginWithGoogleAccount = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (REDIRECT_FALLBACK_ERROR_CODES.has(error?.code)) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    throw error;
  }
};

export const resolveGoogleRedirectSignIn = () => getRedirectResult(auth);

export const startGuestSession = () => signInAnonymously(auth);

export const logoutCurrentUser = () => signOut(auth);
