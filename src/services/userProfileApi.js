import { doc, getDoc, runTransaction, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  buildNicknameReservationPayload,
  ensureNicknameReservation,
  getGuestNicknameBase,
  isNicknameLengthValid,
  normalizeNickname,
  normalizeNicknameKey,
} from "./nicknameApi";
import { getSeoulDateString } from "../utils/date";

const sanitizeBestScore = (bestScore) => (Number.isInteger(bestScore) && bestScore > 0 ? bestScore : 0);
const sanitizeBestNBack = (bestNBack) => (Number.isInteger(bestNBack) ? bestNBack : null);
const sanitizeBestUpdatedAt = (bestUpdatedAt) => bestUpdatedAt ?? null;

const buildUserProfilePayload = ({ user, nickname, existingData, createdAt }) => ({
  uid: user.uid,
  nickname,
  photoURL: user.photoURL || null,
  createdAt: existingData?.createdAt ?? createdAt ?? Timestamp.now(),
  bestScore: sanitizeBestScore(existingData?.bestScore),
  bestNBack: sanitizeBestNBack(existingData?.bestNBack),
  bestUpdatedAt: sanitizeBestUpdatedAt(existingData?.bestUpdatedAt),
});

const syncTodayScoreNickname = async (uid, nickname) => {
  const todayScoreRef = doc(db, "scores", `${uid}_${getSeoulDateString()}`);
  const todayScoreSnap = await getDoc(todayScoreRef);

  if (todayScoreSnap.exists()) {
    await updateDoc(todayScoreRef, {
      nickname,
    });
  }
};

export const syncUserProfile = async (user) => {
  if (!user) {
    return;
  }

  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await transaction.get(userRef);
    const existingData = userSnap.exists() ? userSnap.data() : null;
    const currentNickname = normalizeNickname(existingData?.nickname);
    const preferredNickname =
      existingData?.nickname || (user.isAnonymous ? getGuestNicknameBase(user.uid) : user.displayName);

    const { nickname } = await ensureNicknameReservation(transaction, {
      uid: user.uid,
      preferredNickname,
      currentNickname,
    });

    transaction.set(
      userRef,
      buildUserProfilePayload({
        user,
        nickname,
        existingData,
      }),
    );
  });
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
  const normalizedNickname = normalizeNickname(newNickname);

  if (!isNicknameLengthValid(normalizedNickname)) {
    throw new Error("Nickname must be between 2 and 12 characters.");
  }

  const nextNickname = await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const userData = userSnap.data();
    const currentNickname = normalizeNickname(userData.nickname);
    const currentNicknameKey = normalizeNicknameKey(currentNickname);
    const nextNicknameKey = normalizeNicknameKey(normalizedNickname);

    const currentReservationRef = currentNicknameKey ? doc(db, "nicknames", currentNicknameKey) : null;
    const currentReservationSnap = currentReservationRef ? await transaction.get(currentReservationRef) : null;
    const nextReservationRef = doc(db, "nicknames", nextNicknameKey);
    const nextReservationSnap =
      currentNicknameKey === nextNicknameKey ? currentReservationSnap : await transaction.get(nextReservationRef);

    if (nextReservationSnap?.exists() && nextReservationSnap.data().uid !== uid) {
      throw new Error("That nickname is already in use.");
    }

    const reservationCreatedAt = nextReservationSnap?.exists()
      ? nextReservationSnap.data().createdAt ?? Timestamp.now()
      : Timestamp.now();

    transaction.set(
      nextReservationRef,
      buildNicknameReservationPayload({
        uid,
        nickname: normalizedNickname,
        createdAt: reservationCreatedAt,
      }),
    );

    if (
      currentReservationRef &&
      currentNicknameKey !== nextNicknameKey &&
      currentReservationSnap?.exists() &&
      currentReservationSnap.data().uid === uid
    ) {
      transaction.delete(currentReservationRef);
    }

    transaction.update(userRef, {
      nickname: normalizedNickname,
    });

    return normalizedNickname;
  });

  await syncTodayScoreNickname(uid, nextNickname);
};
