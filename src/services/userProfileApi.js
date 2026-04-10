import { doc, getDoc, runTransaction, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const FALLBACK_NICKNAME = "Player";
const MAX_NICKNAME_LENGTH = 12;
const MAX_NICKNAME_ATTEMPTS = 100;

const normalizeNickname = (nickname) => (typeof nickname === "string" ? nickname.trim() : "");
const normalizeNicknameKey = (nickname) => normalizeNickname(nickname).toLowerCase();
const isNicknameLengthValid = (nickname) => nickname.length >= 2 && nickname.length <= MAX_NICKNAME_LENGTH;
const trimNicknameBase = (nickname) => normalizeNickname(nickname).slice(0, MAX_NICKNAME_LENGTH);

const getTodayDateString = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
};

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

const buildNicknameReservationPayload = ({ uid, nickname, createdAt }) => ({
  uid,
  nickname,
  createdAt: createdAt ?? Timestamp.now(),
});

const getGuestNicknameBase = (uid) => `Guest-${uid.slice(0, 4).toUpperCase()}`;

const getNicknameBase = (preferredNickname) => {
  const trimmedBase = trimNicknameBase(preferredNickname);
  return isNicknameLengthValid(trimmedBase) ? trimmedBase : FALLBACK_NICKNAME;
};

const buildNicknameCandidate = (baseNickname, suffix) => {
  if (suffix === 0) {
    return baseNickname;
  }

  const suffixLabel = `_${suffix}`;
  const baseMaxLength = Math.max(MAX_NICKNAME_LENGTH - suffixLabel.length, 1);
  return `${baseNickname.slice(0, baseMaxLength)}${suffixLabel}`;
};

const findAvailableNickname = async (transaction, { uid, baseNickname }) => {
  for (let suffix = 0; suffix < MAX_NICKNAME_ATTEMPTS; suffix += 1) {
    const candidate = buildNicknameCandidate(baseNickname, suffix);
    const candidateKey = normalizeNicknameKey(candidate);
    const candidateRef = doc(db, "nicknames", candidateKey);
    const candidateSnap = await transaction.get(candidateRef);

    if (!candidateSnap.exists() || candidateSnap.data().uid === uid) {
      return {
        nickname: candidate,
        nicknameKey: candidateKey,
        reservationRef: candidateRef,
        reservationSnap: candidateSnap,
      };
    }
  }

  throw new Error("Unable to reserve nickname.");
};

const ensureNicknameReservation = async (transaction, { uid, preferredNickname, currentNickname }) => {
  const normalizedCurrentNickname = normalizeNickname(currentNickname);
  const currentNicknameKey = normalizeNicknameKey(normalizedCurrentNickname);
  const currentReservationRef = currentNicknameKey ? doc(db, "nicknames", currentNicknameKey) : null;
  const currentReservationSnap = currentReservationRef ? await transaction.get(currentReservationRef) : null;
  const currentTakenByOther =
    currentReservationSnap?.exists() && currentReservationSnap.data().uid !== uid;

  if (isNicknameLengthValid(normalizedCurrentNickname) && !currentTakenByOther) {
    const reservationCreatedAt = currentReservationSnap?.exists()
      ? currentReservationSnap.data().createdAt ?? Timestamp.now()
      : Timestamp.now();

    transaction.set(
      currentReservationRef,
      buildNicknameReservationPayload({
        uid,
        nickname: normalizedCurrentNickname,
        createdAt: reservationCreatedAt,
      }),
    );

    return {
      nickname: normalizedCurrentNickname,
      previousNicknameKey: currentNicknameKey,
    };
  }

  const availableNickname = await findAvailableNickname(transaction, {
    uid,
    baseNickname: getNicknameBase(preferredNickname),
  });

  const reservationCreatedAt = availableNickname.reservationSnap.exists()
    ? availableNickname.reservationSnap.data().createdAt ?? Timestamp.now()
    : Timestamp.now();

  transaction.set(
    availableNickname.reservationRef,
    buildNicknameReservationPayload({
      uid,
      nickname: availableNickname.nickname,
      createdAt: reservationCreatedAt,
    }),
  );

  if (
    currentReservationRef &&
    currentNicknameKey !== availableNickname.nicknameKey &&
    currentReservationSnap?.exists() &&
    currentReservationSnap.data().uid === uid
  ) {
    transaction.delete(currentReservationRef);
  }

  return {
    nickname: availableNickname.nickname,
    previousNicknameKey: currentNicknameKey,
  };
};

const syncTodayScoreNickname = async (uid, nickname) => {
  const todayScoreRef = doc(db, "scores", `${uid}_${getTodayDateString()}`);
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
