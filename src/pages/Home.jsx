    // src/pages/Home.jsx
    import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext'; // 추가
    import ProfileModal from '../components/common/ProfileModal'; // 추가
    import styles from './Home.module.css';

    export default function Home() {
    const navigate = useNavigate();
    // 전역 로그인 상태 사용
    const { currentUser, nickname, loginWithGoogle } = useAuth(); 
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // 게임 설정 상태
    const [nBack, setNBack] = useState(2);
    const [totalSteps, setTotalSteps] = useState(20);
    const [blockDuration, setBlockDuration] = useState(2000);

    const handleStart = () => {
        navigate('/game', {
        state: { nBack, totalSteps, blockDuration }
        });
    };

    return (
        <div className={styles.container}>
        {/* --- 로그인/프로필 구역 (상단 우측 배치 권장) --- */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!currentUser ? (
            // 로그인 전: 로그인 버튼 표시
            <button 
                onClick={loginWithGoogle} 
                style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}
            >
                Google 로그인
            </button>
            ) : (
            // 로그인 후: 프로필 사진과 별명 표시, 클릭 시 모달 오픈
            <div 
                onClick={() => setIsProfileModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
            >
                <img src={currentUser.photoURL} alt="프로필" style={{ width: '30px', height: '30px', borderRefidus: '50%' }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{nickname}</span>
            </div>
            )}
        </div>

        <div className={styles.card}>
            <h1 className={styles.title}>도형 N-Back 훈련</h1>
            <p className={styles.subtitle}>작업 기억력 향상 프로그램</p>

            {/* 난이도 설정 ... (이전 코드와 동일하므로 생략) */}
            
            <button onClick={handleStart} className={styles.startButton}>
            훈련 시작
            </button>
        </div>

        {/* --- 별명 변경 모달 포탈 --- */}
        {isProfileModalOpen && (
            <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
        )}
        </div>
    );
    }