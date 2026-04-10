import { DEFAULT_PROFILE_IMAGE } from "../../constants/profile";
import { useAuth } from "../../contexts/useAuth";
import { useProfileModalForm } from "../../hooks/useProfileModalForm";
import styles from "./ProfileModal.module.css";

export default function ProfileModal({ onClose }) {
  const { currentUser, isGuest, nickname, setNickname, logout } = useAuth();
  const { newNickname, error, setNewNickname, handleChangeNickname } = useProfileModalForm({
    currentUser,
    nickname,
    setNickname,
    onClose,
  });

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!currentUser || isGuest) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <img
            src={currentUser.photoURL || DEFAULT_PROFILE_IMAGE}
            alt="프로필"
            className={styles.profileImage}
          />
          <div className={styles.nameInfo}>
            <span className={styles.nicknameDisplay}>{nickname}</span>
            <span className={styles.googleNameDisplay}>@{currentUser.displayName ?? "google-user"}</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>닉네임 변경</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="새 닉네임 (2~12자)"
              value={newNickname}
              onChange={(event) => setNewNickname(event.target.value)}
              className={styles.nicknameInput}
            />
            <button className={styles.changeButton} onClick={handleChangeNickname}>
              변경
            </button>
          </div>
          {error && <p style={{ color: "#E65A2D", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
        </div>

        <div className={styles.logoutArea}>
          <button className={styles.logoutButton} onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
