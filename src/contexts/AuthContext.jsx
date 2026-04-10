import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./auth-context";
import { auth } from "../services/firebase";
import {
  loginWithGoogleAccount,
  logoutCurrentUser,
  resolveGoogleRedirectSignIn,
  startGuestSession,
} from "../services/authApi";
import { getUserNickname, syncUserProfile } from "../services/userProfileApi";

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
    try {
      const result = await loginWithGoogleAccount();

      if (!result?.user) {
        return { ok: false, redirected: true };
      }

      await syncSignedInUser(result.user);
      return { ok: true, redirected: false };
    } catch (error) {
      console.error("Failed to sign in with Google.", error);
      return { ok: false, error };
    }
  };

  const logout = async () => {
    setNickname(null);
    return logoutCurrentUser();
  };

  useEffect(() => {
    const resolveRedirectSignIn = async () => {
      try {
        await resolveGoogleRedirectSignIn();
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
              await startGuestSession();
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
