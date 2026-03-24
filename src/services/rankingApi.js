    // src/services/rankingApi.js
    import { db } from "./firebase";
    import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs, 
    Timestamp, 
    doc, 
    getDoc 
    } from "firebase/firestore";

    /**
     * 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환합니다.
     */
    const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    };

    /**
     * 게임 종료 시 점수를 저장합니다.
     * @param {object} userData - 유저 정보 (uid, nickname, photoURL)
     * @param {number} score - 최종 점수
     * @param {number} nBack - 선택한 N-back 난이도
     */
    export const saveScore = async (userData, score, nBack) => {
    try {
        const todayString = getTodayDateString();

        await addDoc(collection(db, "scores"), {
        uid: userData.uid,
        nickname: userData.nickname, // 백업용 저장
        photoURL: userData.photoURL, // 백업용 저장
        score: score,
        nBack: nBack,
        dateString: todayString, // 당일 조회를 위한 키
        timestamp: Timestamp.now(), 
        });
        console.log(`[Success] 점수 저장 완료: ${score}점 (${nBack}-back)`);
    } catch (error) {
        console.error("[Error] 점수 저장 실패:", error);
    }
    };

    /**
     * 오늘 날짜의 상위 10개 점수를 불러옵니다.
     * 랭킹에 표시될 유저 정보는 'users' 컬렉션에서 실시간으로 가져와 최신 상태를 유지합니다.
     */
    export const getDailyRanking = async () => {
    try {
        const todayString = getTodayDateString();
        const scoresRef = collection(db, "scores");
        
        // 1. 오늘 날짜 데이터 중 점수 높은 순으로 10개 쿼리
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

        // 2. [핵심] 유저 정보를 최신화하기 위한 Join 로직
        // 각 점수 기록의 uid를 이용해 users 컬렉션에서 현재 닉네임과 사진을 가져옵니다.
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
            return item; // 유저 정보가 없으면 scores에 저장된 기존 정보 사용
            } catch (err) {
            console.warn(`[Warn] 유저 프로필 조회 실패 (UID: ${item.uid})`, err);
            return item;
            }
        })
        );

        return rankingWithFreshProfile;
    } catch (error) {
        console.error("[Error] 랭킹 조회 실패:", error);
        return [];
    }
    };