import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { AuthContext } from "./auth-context";
import { auth, googleProvider } from "../services/firebase";
import { getUserNickname, syncUserProfile } from "../services/userProfileApi";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(result.user);
      const nextNickname = await getUserNickname(result.user.uid);
      setNickname(nextNickname);
    } catch (error) {
      console.error("Failed to sign in with Google.", error);
    }
  };

  const logout = async () => {
    setNickname(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const nextNickname = await getUserNickname(user.uid);
        setNickname(nextNickname);
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
