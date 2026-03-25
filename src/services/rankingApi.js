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
    getDoc,
    updateDoc // 기록 갱신을 위해 updateDoc 추가
    } from "firebase/firestore";

    const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    };

    export const saveScore = async (userData, score, nBack) => {
    try {
        const todayString = getTodayDateString();
        const scoresRef = collection(db, "scores");
        
        // 유저의 오늘 기록이 이미 존재하는지 검사
        const q = query(
            scoresRef,
            where("dateString", "==", todayString),
            orderBy("score", "desc"), 
            limit(10) 
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const existingScore = docSnap.data().score;
        
        // 기존 기록보다 새로 획득한 점수가 더 높을 경우에만 덮어쓰기
        if (score > existingScore) {
            await updateDoc(doc(db, "scores", docSnap.id), {
            score: score,
            nBack: nBack,
            timestamp: Timestamp.now()
            });
            console.log(`최고 점수 갱신 완료: ${score}점`);
        } else {
            console.log(`기존 점수가 더 높거나 같아 기록을 갱신하지 않습니다.`);
        }
        } else {
        // 오늘 기록이 없으면 새 문서 생성
        await addDoc(scoresRef, {
            uid: userData.uid,
            nickname: userData.nickname,
            photoURL: userData.photoURL,
            score: score,
            nBack: nBack,
            dateString: todayString,
            timestamp: Timestamp.now(), 
        });
        console.log(`점수 첫 등록 완료: ${score}점`);
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
        orderBy("score", "desc"), 
        limit(10) 
        );

        const querySnapshot = await getDocs(q);
        const rawRankingList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));

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
            return item;
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