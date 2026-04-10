import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

const FALLBACK_NICKNAME = "Player";
const MAX_NICKNAME_LENGTH = 12;

const normalizeNickname = (nickname) => (typeof nickname === "string" ? nickname.trim() : "");
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

const buildUserProfilePayload = ({ user, nickname, existingData }) => ({
  uid: user.uid,
  nickname,
  photoURL: user.photoURL || null,
  createdAt: existingData?.createdAt ?? new Date(),
  bestScore: sanitizeBestScore(existingData?.bestScore),
  bestNBack: sanitizeBestNBack(existingData?.bestNBack),
  bestUpdatedAt: sanitizeBestUpdatedAt(existingData?.bestUpdatedAt),
});

const getGuestNicknameBase = (uid) => `Guest-${uid.slice(0, 4).toUpperCase()}`;

const createUniqueNickname = async (preferredNickname, uid) => {
  const trimmedBase = trimNicknameBase(preferredNickname);
  const normalizedBase = isNicknameLengthValid(trimmedBase) ? trimmedBase : FALLBACK_NICKNAME;
  const usersRef = collection(db, "users");
  let candidate = normalizedBase;
  let suffix = 1;

  while (true) {
    const nicknameQuery = query(usersRef, where("nickname", "==", candidate));
    const snapshot = await getDocs(nicknameQuery);
    const isAvailable = snapshot.empty || snapshot.docs.every((snapshotDoc) => snapshotDoc.id === uid);

    if (isAvailable) {
      return candidate;
    }

    const suffixLabel = `_${suffix}`;
    const baseMaxLength = Math.max(MAX_NICKNAME_LENGTH - suffixLabel.length, 1);
    candidate = `${normalizedBase.slice(0, baseMaxLength)}${suffixLabel}`;
    suffix += 1;
  }
};

export const syncUserProfile = async (user) => {
  if (!user) {
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const initialNickname = await createUniqueNickname(
      user.isAnonymous ? getGuestNicknameBase(user.uid) : user.displayName,
      user.uid,
    );

    await setDoc(
      userRef,
      buildUserProfilePayload({
        user,
        nickname: initialNickname,
      }),
    );
    return;
  }

  const existingData = userSnap.data();
  const nicknameToKeep = isNicknameLengthValid(normalizeNickname(existingData.nickname))
    ? normalizeNickname(existingData.nickname)
    : await createUniqueNickname(
        existingData.nickname || (user.isAnonymous ? getGuestNicknameBase(user.uid) : user.displayName),
        user.uid,
      );

  await setDoc(
    userRef,
    buildUserProfilePayload({
      user,
      nickname: nicknameToKeep,
      existingData,
    }),
  );
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

  if (!normalizedNickname || normalizedNickname.length < 2 || normalizedNickname.length > 12) {
    throw new Error("Nickname must be between 2 and 12 characters.");
  }

  const usersRef = collection(db, "users");
  const nicknameQuery = query(usersRef, where("nickname", "==", normalizedNickname));
  const querySnapshot = await getDocs(nicknameQuery);

  if (!querySnapshot.empty) {
    const isMine = querySnapshot.docs.some((snapshotDoc) => snapshotDoc.id === uid);
    if (!isMine) {
      throw new Error("That nickname is already in use.");
    }
  }

  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    nickname: normalizedNickname,
  });

  const todayScoreRef = doc(db, "scores", `${uid}_${getTodayDateString()}`);
  const todayScoreSnap = await getDoc(todayScoreRef);

  if (todayScoreSnap.exists()) {
    await updateDoc(todayScoreRef, {
      nickname: normalizedNickname,
    });
  }
};
