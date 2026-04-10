import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getSeoulDateString } from "../utils/date";

const normalizeNickname = (nickname) => {
  if (typeof nickname !== "string") {
    return "Anonymous";
  }

  const trimmed = nickname.trim();
  return trimmed || "Anonymous";
};

const buildScorePayload = ({ userData, score, nBack, totalSteps, blockDuration, todayString }) => ({
  uid: userData.uid,
  nickname: normalizeNickname(userData.nickname),
  photoURL: userData.photoURL || null,
  score,
  nBack,
  totalSteps,
  blockDuration,
  dateString: todayString,
  timestamp: Timestamp.now(),
});

const isSavableScore = ({ score, nBack, totalSteps, blockDuration, userData }) =>
  Boolean(userData?.uid) &&
  Number.isInteger(score) &&
  Number.isInteger(nBack) &&
  Number.isInteger(totalSteps) &&
  Number.isInteger(blockDuration);

const dedupeRankingByUser = (rankingList) => {
  const uniqueRankingList = [];
  const seenUsers = new Set();

  for (const item of rankingList) {
    if (seenUsers.has(item.uid)) {
      continue;
    }

    seenUsers.add(item.uid);
    uniqueRankingList.push(item);
  }

  return uniqueRankingList;
};

const upsertUserBestScore = async ({ userData, score, nBack }) => {
  const userRef = doc(db, "users", userData.uid);
  const userSnap = await getDoc(userRef);
  const normalizedNickname = normalizeNickname(userData.nickname);
  const nextPhotoURL = userData.photoURL || null;

  if (!userSnap.exists()) {
    const now = Timestamp.now();
    await setDoc(userRef, {
      uid: userData.uid,
      nickname: normalizedNickname,
      photoURL: nextPhotoURL,
      createdAt: now,
      bestScore: score > 0 ? score : 0,
      bestNBack: score > 0 ? nBack : null,
      bestUpdatedAt: score > 0 ? now : null,
    });
    return;
  }

  const existingData = userSnap.data();
  const currentBestScore = Number.isInteger(existingData.bestScore) ? existingData.bestScore : 0;
  const nextUpdate = {
    nickname: normalizedNickname,
    photoURL: nextPhotoURL,
  };

  if (score > currentBestScore) {
    nextUpdate.bestScore = score;
    nextUpdate.bestNBack = nBack;
    nextUpdate.bestUpdatedAt = Timestamp.now();
  }

  await updateDoc(userRef, nextUpdate);
};

export const saveScore = async (userData, scoreData) => {
  const { score, nBack, totalSteps, blockDuration } = scoreData;

  if (!isSavableScore({ score, nBack, totalSteps, blockDuration, userData })) {
    console.error("Invalid score payload.", { userData, scoreData });
    return false;
  }

  try {
    const todayString = getSeoulDateString();
    const scoreDocId = `${userData.uid}_${todayString}`;
    const scoreDocRef = doc(db, "scores", scoreDocId);
    const scoreDocSnap = await getDoc(scoreDocRef);

    if (scoreDocSnap.exists()) {
      const existingScore = scoreDocSnap.data().score;

      if (score <= existingScore) {
        await upsertUserBestScore({ userData, score, nBack });
        return false;
      }

      await updateDoc(scoreDocRef, buildScorePayload({ userData, score, nBack, totalSteps, blockDuration, todayString }));
      await upsertUserBestScore({ userData, score, nBack });
      return true;
    }

    await setDoc(scoreDocRef, buildScorePayload({ userData, score, nBack, totalSteps, blockDuration, todayString }));
    await upsertUserBestScore({ userData, score, nBack });
    return true;
  } catch (error) {
    console.error("Failed to save score.", error);
    return false;
  }
};

export const getDailyRanking = async () => {
  try {
    const todayString = getSeoulDateString();
    const scoresRef = collection(db, "scores");
    const rankingQuery = query(
      scoresRef,
      where("dateString", "==", todayString),
      orderBy("score", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(rankingQuery);

    return querySnapshot.docs.map((scoreDoc) => ({
      id: scoreDoc.id,
      ...scoreDoc.data(),
    }));
  } catch (error) {
    console.error("Failed to fetch ranking.", error);
    return [];
  }
};

export const getAllTimeRanking = async () => {
  try {
    const scoresRef = collection(db, "scores");
    const rankingQuery = query(scoresRef, orderBy("score", "desc"));
    const querySnapshot = await getDocs(rankingQuery);

    const rankingList = querySnapshot.docs.map((scoreDoc) => ({
      id: scoreDoc.id,
      ...scoreDoc.data(),
    }));

    return dedupeRankingByUser(rankingList).slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch all-time ranking.", error);
    return [];
  }
};
