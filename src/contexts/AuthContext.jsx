    // src/contexts/AuthContext.jsx
    import { createContext, useContext, useState, useEffect } from "react";
    import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
    import { auth, googleProvider } from "../services/firebase";
    import { syncUserProfile, getUserNickname } from "../services/userProfileApi";

    // 1. Context 생성
    const AuthContext = createContext();

    // 2. Provider 컴포넌트 생성
    export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [nickname, setNickname] = useState(null);     
    const [loading, setLoading] = useState(true);        

    // 함수: 구글 로그인
    const loginWithGoogle = async () => {
        try {
        const result = await signInWithPopup(auth, googleProvider);
        await syncUserProfile(result.user);
        const name = await getUserNickname(result.user.uid);
        setNickname(name);
        } catch (error) {
        console.error("로그인 실패:", error);
        }
    };

    // 함수: 로그아웃
    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
            const name = await getUserNickname(user.uid);
            setNickname(name);
        } else {
            setNickname(null);
        }
        setLoading(false); 
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        nickname,
        setNickname, 
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    );
    }

    // 3. 커스텀 훅
    export function useAuth() {
    return useContext(AuthContext);
    }