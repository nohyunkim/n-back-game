import { useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
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

  const syncSignedInUser = async (user) => {
    await syncUserProfile(user);
    const nextNickname = await getUserNickname(user.uid);
    setNickname(nextNickname);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncSignedInUser(result.user);
      return { ok: true };
    } catch (error) {
      if (REDIRECT_FALLBACK_ERROR_CODES.has(error?.code)) {
        try {
          await signInWithRedirect(auth, googleProvider);
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
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await syncSignedInUser(result.user);
        }
      } catch (error) {
        console.error("Failed to resolve Google redirect sign-in.", error);
      }
    };

    void resolveRedirectSignIn();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await syncSignedInUser(user);
      } else {
        setNickname(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
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
