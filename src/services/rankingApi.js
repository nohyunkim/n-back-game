import { db } from "./firebase";
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    getDocs, 
    Timestamp, 
    doc, 
    getDoc,
    setDoc,
    updateDoc
    } from "firebase/firestore";

const getTodayDateString = () => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return formatter.format(new Date());
};

export const saveScore = async (userData, score, nBack) => {
    try {
        const todayString = getTodayDateString();
        const scoreDocId = `${userData.uid}_${todayString}`;
        const scoreDocRef = doc(db, "scores", scoreDocId);
        const scoreDocSnap = await getDoc(scoreDocRef);

        if (scoreDocSnap.exists()) {
            const existingScore = scoreDocSnap.data().score;

            if (score > existingScore) {
                await updateDoc(scoreDocRef, {
                    score,
                    nBack,
                    nickname: userData.nickname,
                    photoURL: userData.photoURL,
                    timestamp: Timestamp.now(),
                });
                console.log(`오늘 최고 점수 갱신 완료: ${score}점`);
            } else {
                console.log("기존 오늘 최고 점수가 더 높거나 같아 기록을 유지합니다.");
            }
        } else {
            await setDoc(scoreDocRef, {
                uid: userData.uid,
                nickname: userData.nickname,
                photoURL: userData.photoURL,
                score,
                nBack,
                dateString: todayString,
                timestamp: Timestamp.now(),
            });
            console.log(`오늘 점수 첫 등록 완료: ${score}점`);
        }
    } catch (error) {
        console.error("점수 저장 실패:", error);
    }
};

    export const getDailyRanking = async () => {
    try {
        const todayString = getTodayDateString();
        const scoresRef = collection(db, "scores");
        
        const q = query(
        scoresRef,
        where("dateString", "==", todayString),
        orderBy("score", "desc")
        );

        const querySnapshot = await getDocs(q);
        const rawRankingList = querySnapshot.docs.map((scoreDoc) => ({
        id: scoreDoc.id,
        ...scoreDoc.data()
        }));

        // 과거 중복 문서가 남아 있어도 랭킹에는 유저별 최고 점수 1개만 노출합니다.
        const uniqueRankingList = [];
        const seenUsers = new Set();

        for (const item of rawRankingList) {
            if (seenUsers.has(item.uid)) continue;
            seenUsers.add(item.uid);
            uniqueRankingList.push(item);
        }

        const rankingWithFreshProfile = await Promise.all(
        uniqueRankingList.map(async (item) => {
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
            return item;
            } catch (err) {
            console.warn(`유저 프로필 조회 실패 (UID: ${item.uid})`, err);
            return item;
            }
        })
        );

        return rankingWithFreshProfile.slice(0, 10);
    } catch (error) {
        console.error("랭킹 조회 실패:", error);
        return [];
    }
    };
