    // src/services/userProfileApi.js
    import { db } from "./firebase";
    import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

    /**
     * 유저 프로필 정보를 Firestore에 저장하거나 업데이트합니다.
     * 처음 로그인 시 구글 정보를 기본으로 저장합니다.
     */
    export const syncUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid); // 유저 UID를 문서 ID로 사용
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // 1. 처음 로그인한 유저라면 구글 정보를 기본으로 프로필 생성
        // 참고 사진의 "처음에는 그대로 받되" 기능 구현
        await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName, // 구글 이름
        photoURL: user.photoURL,     // 구글 프로필 사진
        nickname: user.displayName,   // 초기 별명은 구글 이름과 동일
        email: user.email,
        createdAt: new Date(),
        });
        console.log("새 프로필 생성 완료:", user.displayName);
    } else {
        // 2. 이미 존재하는 유저라면 로그인 시간 등만 업데이트 (선택 사항)
        console.log("기존 유저 로그인:", userSnap.data().nickname);
    }
    };

    /**
     * 유저의 별명을 Firestore에서 가져옵니다.
     */
    export const getUserNickname = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().nickname;
    }
    return null;
    };

    /**
     * 유저의 별명을 업데이트합니다.
     * 참고 사진 7번의 "변경하기" 기능 구현
     */
    export const updateUserNickname = async (uid, newNickname) => {
    if (!newNickname || newNickname.length < 2 || newNickname.length > 12) {
        throw new Error("별명은 2~12자 사이여야 합니다.");
    }

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        nickname: newNickname,
    });
    };