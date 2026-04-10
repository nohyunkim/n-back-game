import { useEffect, useRef, useState } from "react";
import {
  getRedirectResult,
  linkWithPopup,
  linkWithRedirect,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { AuthContext } from "./auth-context";
import { auth, googleProvider } from "../services/firebase";
import { getUserNickname, syncUserProfile } from "../services/userProfileApi";

const REDIRECT_FALLBACK_ERROR_CODES = new Set([
  "auth/popup-blocked",
  "auth/cancelled-popup-request",
]);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [loading, setLoading] = useState(true);
  const guestLoginStartedRef = useRef(false);

  const syncSignedInUser = async (user) => {
    await syncUserProfile(user);
    const nextNickname = await getUserNickname(user.uid);
    setNickname(nextNickname);
  };

  const loginWithGoogle = async () => {
    const activeUser = auth.currentUser;

    try {
      const result = activeUser?.isAnonymous
        ? await linkWithPopup(activeUser, googleProvider)
        : await signInWithPopup(auth, googleProvider);
      await syncSignedInUser(result.user);
      return { ok: true };
    } catch (error) {
      if (REDIRECT_FALLBACK_ERROR_CODES.has(error?.code)) {
        try {
          if (activeUser?.isAnonymous) {
            await linkWithRedirect(activeUser, googleProvider);
          } else {
            await signInWithRedirect(auth, googleProvider);
          }
          return { ok: false, redirected: true };
        } catch (redirectError) {
          console.error("Failed to sign in with Google redirect.", redirectError);
          return { ok: false, error: redirectError };
        }
      }

      console.error("Failed to sign in with Google.", error);
      return { ok: false, error };
    }
  };

  const logout = async () => {
    setNickname(null);
    return signOut(auth);
  };

  useEffect(() => {
    const resolveRedirectSignIn = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        console.error("Failed to resolve Google redirect sign-in.", error);
      }
    };

    void resolveRedirectSignIn();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let shouldFinishLoading = true;
      setCurrentUser(user);

      try {
        if (user) {
          guestLoginStartedRef.current = false;
          await syncSignedInUser(user);
        } else {
          setNickname(null);
          if (!guestLoginStartedRef.current) {
            guestLoginStartedRef.current = true;
            try {
              shouldFinishLoading = false;
              await signInAnonymously(auth);
              return;
            } catch (guestError) {
              console.error("Failed to start guest session.", guestError);
              guestLoginStartedRef.current = false;
              shouldFinishLoading = true;
            }
          }
        }
      } catch (error) {
        console.error("Failed to sync signed-in user.", error);
        setNickname(null);
      } finally {
        if (shouldFinishLoading) {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isGuest: Boolean(currentUser?.isAnonymous),
        nickname,
        setNickname,
        loginWithGoogle,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
