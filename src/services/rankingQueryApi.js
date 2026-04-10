import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getSeoulDateString } from "../utils/date";
import { db } from "./firebase";

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

export const getDailyRanking = async () => {
  const rankingList = await getDailyRankingList();
  return rankingList.slice(0, 10);
};

export const getDailyRankingList = async () => {
  try {
    const todayString = getSeoulDateString();
    const scoresRef = collection(db, "scores");
    const rankingQuery = query(
      scoresRef,
      where("dateString", "==", todayString),
      orderBy("score", "desc"),
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
  const rankingList = await getAllTimeRankingList();
  return rankingList.slice(0, 10);
};

export const getAllTimeRankingList = async () => {
  try {
    const scoresRef = collection(db, "scores");
    const rankingQuery = query(scoresRef, orderBy("score", "desc"));
    const querySnapshot = await getDocs(rankingQuery);

    const rankingList = querySnapshot.docs.map((scoreDoc) => ({
      id: scoreDoc.id,
      ...scoreDoc.data(),
    }));

    return dedupeRankingByUser(rankingList);
  } catch (error) {
    console.error("Failed to fetch all-time ranking.", error);
    return [];
  }
};
