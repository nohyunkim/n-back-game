    // src/services/rankingApi.js
    import { db } from "./firebase";
    import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";

    /**
     * 게임 종료 시 점수와 유저 정보를 저장합니다.
     */
    export const saveScore = async (userData, score, nBack) => {
    try {
        await addDoc(collection(db, "scores"), {
        uid: userData.uid,
        nickname: userData.nickname, // 별명 변경이 반영된 닉네임 저장
        photoURL: userData.photoURL,
        score: score,
        nBack: nBack,
        timestamp: Timestamp.now(), // 현재 시간 저장
        });
        console.log("점수 저장 완료!");
    } catch (error) {
        console.error("점수 저장 실패:", error);
    }
    };

    /**
     * 오늘 날짜의 상위 10개 점수를 불러옵니다.
     */
    export const getDailyRanking = async () => {
    // 오늘 자정(0시 0분 0초)의 타임스탬프 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scoresRef = collection(db, "scores");
    // 쿼리: 오늘 데이터만, 점수 높은 순으로 10개
    const q = query(
        scoresRef,
        where("timestamp", ">=", Timestamp.fromDate(today)),
        orderBy("timestamp", "desc"), // 최신 순 정렬 후 점수로 재정렬은 클라이언트에서 처리 권장 (인덱스 문제 방지)
        limit(50) 
    );

    const querySnapshot = await getDocs(q);
    const rankingList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // 점수 내림차순 정렬 후 상위 10개 반환
    return rankingList.sort((a, b) => b.score - a.score).slice(0, 10);
    };