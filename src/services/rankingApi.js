import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

const getTodayDateString = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
};

const normalizeNickname = (nickname) => {
  if (typeof nickname !== "string") {
    return "Anonymous";
  }

  const trimmed = nickname.trim();
  return trimmed || "Anonymous";
};

const buildScorePayload = ({ userData, score, nBack, todayString }) => ({
  uid: userData.uid,
  nickname: normalizeNickname(userData.nickname),
  photoURL: userData.photoURL || null,
  score,
  nBack,
  dateString: todayString,
  timestamp: Timestamp.now(),
});

const isSavableScore = (score, nBack, userData) =>
  Boolean(userData?.uid) && Number.isInteger(score) && Number.isInteger(nBack);

export const saveScore = async (userData, score, nBack) => {
  if (!isSavableScore(score, nBack, userData)) {
    console.error("Invalid score payload.", { userData, score, nBack });
    return false;
  }

  try {
    const todayString = getTodayDateString();
    const scoreDocId = `${userData.uid}_${todayString}`;
    const scoreDocRef = doc(db, "scores", scoreDocId);
    const scoreDocSnap = await getDoc(scoreDocRef);

    if (scoreDocSnap.exists()) {
      const existingScore = scoreDocSnap.data().score;

      if (score <= existingScore) {
        return false;
      }

      await updateDoc(scoreDocRef, buildScorePayload({ userData, score, nBack, todayString }));
      return true;
    }

    await setDoc(scoreDocRef, buildScorePayload({ userData, score, nBack, todayString }));
    return true;
  } catch (error) {
    console.error("Failed to save score.", error);
    return false;
  }
};

export const getDailyRanking = async () => {
  try {
    const todayString = getTodayDateString();
    const scoresRef = collection(db, "scores");
    const rankingQuery = query(scoresRef, where("dateString", "==", todayString), orderBy("score", "desc"));
    const querySnapshot = await getDocs(rankingQuery);

    const rankingList = querySnapshot.docs.map((scoreDoc) => ({
      id: scoreDoc.id,
      ...scoreDoc.data(),
    }));

    const uniqueRankingList = [];
    const seenUsers = new Set();

    for (const item of rankingList) {
      if (seenUsers.has(item.uid)) {
        continue;
      }

      seenUsers.add(item.uid);
      uniqueRankingList.push(item);
    }

    return uniqueRankingList.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch ranking.", error);
    return [];
  }
};
