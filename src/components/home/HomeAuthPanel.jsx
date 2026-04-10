import { DEFAULT_PROFILE_IMAGE } from "../../constants/profile";

export default function HomeAuthPanel({
  currentUser,
  isGuest,
  nickname,
  onLogin,
  onOpenProfile,
  styles,
}) {
  return (
    <div className={styles.authBar}>
      <div className={styles.authActions}>
        {currentUser && (
          <div
            onClick={isGuest ? undefined : onOpenProfile}
            className={`${styles.profileBadge} ${isGuest ? `${styles.profileBadgeStatic} ${styles.profileBadgeCompact}` : ""}`}
          >
            <img src={currentUser.photoURL || DEFAULT_PROFILE_IMAGE} alt="프로필" />
            <span>{nickname}</span>
          </div>
        )}
        {(!currentUser || isGuest) && (
          <button onClick={onLogin} className={styles.loginBtn}>
            <span className={styles.googleIcon} aria-hidden="true">
              G
            </span>
            <span className={styles.loginText}>{isGuest ? "Google 로그인 연결" : "Google 계정으로 계속"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
