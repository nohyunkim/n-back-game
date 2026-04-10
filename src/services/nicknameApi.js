import { doc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const FALLBACK_NICKNAME = "Player";
const MAX_NICKNAME_LENGTH = 12;
const MAX_NICKNAME_ATTEMPTS = 100;

export const normalizeNickname = (nickname) => (typeof nickname === "string" ? nickname.trim() : "");

export const normalizeNicknameKey = (nickname) => normalizeNickname(nickname).toLowerCase();

export const isNicknameLengthValid = (nickname) =>
  nickname.length >= 2 && nickname.length <= MAX_NICKNAME_LENGTH;

const trimNicknameBase = (nickname) => normalizeNickname(nickname).slice(0, MAX_NICKNAME_LENGTH);

export const getGuestNicknameBase = (uid) => `Guest-${uid.slice(0, 4).toUpperCase()}`;

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

export const buildNicknameReservationPayload = ({ uid, nickname, createdAt }) => ({
  uid,
  nickname,
  createdAt: createdAt ?? Timestamp.now(),
});

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

export const ensureNicknameReservation = async (transaction, { uid, preferredNickname, currentNickname }) => {
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
