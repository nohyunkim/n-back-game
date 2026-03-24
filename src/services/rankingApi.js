    // src/services/rankingApi.js
    import { db } from "./firebase";
    import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";

    /**
     * 날짜 문자열 포맷팅 유틸리티 함수 (YYYY-MM-DD 형식)
     */
    const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    };

    /**
     * 게임 종료 시 점수와 유저 정보를 저장합니다.
     */
    export const saveScore = async (userData, score, nBack) => {
    try {
        const todayString = getTodayDateString();

        await addDoc(collection(db, "scores"), {
        uid: userData.uid,
        // 닉네임과 사진은 백업용으로 저장하지만, 실제 렌더링 시에는 users 컬렉션에서 최신화된 데이터를 씁니다.
        nickname: userData.nickname, 
        photoURL: userData.photoURL,
        score: score,
        nBack: nBack,
        dateString: todayString, // 당일 랭킹 조회를 위한 파티션 키
        timestamp: Timestamp.now(), 
        });
        console.log("점수 저장 완료!");
    } catch (error) {
        console.error("점수 저장 실패:", error);
    }
    };

    /**
     * 오늘 날짜의 상위 10개 점수를 불러옵니다. (최신 프로필 정보 반영)
     */
    export const getDailyRanking = async () => {
    try {
        const todayString = getTodayDateString();
        const scoresRef = collection(db, "scores");
        
        // dateString을 이용한 완전 일치 검색으로, DB단에서 점수 내림차순 Top 10을 정확히 가져옵니다.
        const q = query(
        scoresRef,
        where("dateString", "==", todayString),
        orderBy("score", "desc"), 
        limit(10) 
        );

        const querySnapshot = await getDocs(q);
        const rawRankingList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));

        // 최신 닉네임 반영을 위해 users 컬렉션에서 현재 유저 정보를 병렬로 가져옵니다.
        // (만약 users 컬렉션 구조가 다르다면 이 부분을 프로젝트에 맞게 수정하세요)
        const rankingWithFreshProfile = await Promise.all(
        rawRankingList.map(async (item) => {
            try {
            const userDocRef = doc(db, "users", item.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                const freshUserData = userDocSnap.data();
                return {
                ...item,
                nickname: freshUserData.nickname || item.nickname,
                photoURL: freshUserData.photoURL || item.photoURL,
                };
            }
            return item; // users 정보가 없으면 scores에 저장된 기존 정보 사용
            } catch (err) {
            console.warn(`유저 프로필 조회 실패 (UID: ${item.uid})`, err);
            return item;
            }
        })
        );

        return rankingWithFreshProfile;
    } catch (error) {
        console.error("랭킹 조회 실패:", error);
        return [];
    }
    };