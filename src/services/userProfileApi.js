    import { db } from "./firebase";
    import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

    export const syncUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        let initialNickname = user.displayName;
        
        // 가입 시 구글 이름이 이미 다른 유저의 닉네임과 겹치는지 검사
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("nickname", "==", initialNickname));
        const snapshot = await getDocs(q);
        
        // 중복된다면 뒤에 임의의 숫자를 붙임
        if (!snapshot.empty) {
        initialNickname = `${initialNickname}_${Math.floor(Math.random() * 10000)}`;
        }

        await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        nickname: initialNickname,
        email: user.email,
        createdAt: new Date(),
        });
        console.log("새 프로필 생성 완료:", user.displayName);
    } else {
        console.log("기존 유저 로그인:", userSnap.data().nickname);
    }
    };

    export const getUserNickname = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().nickname;
    }
    return null;
    };

    export const updateUserNickname = async (uid, newNickname) => {
    if (!newNickname || newNickname.length < 2 || newNickname.length > 12) {
        throw new Error("별명은 2~12자 사이여야 합니다.");
    }

    // 닉네임 변경 시 중복 검사
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("nickname", "==", newNickname));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        // 겹치는 닉네임이 있는데, 그게 자기 자신이면 변경 진행(통과)
        const isMine = querySnapshot.docs.some(doc => doc.id === uid);
        if (!isMine) {
        throw new Error("이미 다른 유저가 사용 중인 별명입니다.");
        }
    }

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        nickname: newNickname,
    });
    };