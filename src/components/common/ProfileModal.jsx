    // src/components/common/ProfileModal.jsx
    import { useState } from 'react';
    import { useAuth } from '../../contexts/useAuth';
    import { updateUserNickname } from '../../services/userProfileApi';
    import styles from './ProfileModal.module.css';

    export default function ProfileModal({ onClose }) {
    const { currentUser, nickname, setNickname, logout } = useAuth();
    const [newNickname, setNewNickname] = useState('');
    const [error, setError] = useState('');

    // 별명 변경 처리 함수
    const handleChangeNickname = async () => {
        const normalizedNickname = newNickname.trim();

        try {
        setError('');
        if (normalizedNickname === nickname) {
            setError('현재 별명과 같습니다.');
            return;
        }
        await updateUserNickname(currentUser.uid, normalizedNickname);
        setNickname(normalizedNickname); // 전역 상태 업데이트 (홈 화면 반영)
        setNewNickname('');
        onClose(); // 모달 닫기
        alert('별명이 변경되었습니다.');
        } catch (err) {
        setError(err.message);
        }
    };

    // 모달 밖을 클릭하면 닫히게 함
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    if (!currentUser) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
            {/* 우상단 닫기 X 버튼 */}
            <button className={styles.closeButton} onClick={onClose}>✕</button>

            {/* 상단 헤더: 사진, 별명, 구글이름 */}
            <div className={styles.header}>
            <img src={currentUser.photoURL} alt="프로필" className={styles.profileImage} />
            <div className={styles.nameInfo}>
                <span className={styles.nicknameDisplay}>{nickname}</span>
                <span className={styles.googleNameDisplay}>@{currentUser.displayName}</span>
            </div>
            </div>

            {/* 별명 변경 입력창 구역 */}
            <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>별명 변경</label>
            <div className={styles.inputWrapper}>
                <input 
                type="text" 
                placeholder="새 별명 (2~12자)" 
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className={styles.nicknameInput}
                />
                <button className={styles.changeButton} onClick={handleChangeNickname}>변경하기</button>
            </div>
            {error && <p style={{ color: '#E65A2D', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
            </div>

            {/* 로그아웃 구역 */}
            <div className={styles.logoutArea}>
            <button className={styles.logoutButton} onClick={logout}>로그아웃</button>
            </div>
        </div>
        </div>
    );
    }
