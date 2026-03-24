    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';
    import { getDailyRanking } from '../services/rankingApi';
    import ProfileModal from '../components/common/ProfileModal';
    import styles from './Home.module.css';

    export default function Home() {
    const navigate = useNavigate();
    const { currentUser, nickname, loginWithGoogle } = useAuth();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [topRanking, setTopRanking] = useState([]);

    const [nBack, setNBack] = useState(2);
    const [totalSteps, setTotalSteps] = useState(30);
    const [speed, setSpeed] = useState(2.0);

    useEffect(() => {
        getDailyRanking().then(data => setTopRanking(data.slice(0, 10)));
    }, []);

    const handleStart = () => {
        if (!currentUser) return alert('로그인이 필요합니다!');
        navigate('/game', { state: { nBack, totalSteps, blockDuration: speed * 1000 } });
    };

    return (
        <div className={styles.container}>
        <div className={styles.authBar}>
            {!currentUser ? (
            <button onClick={loginWithGoogle} className={styles.loginBtn}>Google 로그인</button>
            ) : (
            <div onClick={() => setIsProfileModalOpen(true)} className={styles.profileBadge}>
                <img src={currentUser.photoURL} alt="P" />
                <span>{nickname}</span>
            </div>
            )}
        </div>

        <div className={styles.content}>
            <div className={styles.card}>
            <h1 className={styles.title}>N-BACK CHALLENGE</h1>
            <p className={styles.subtitle}>집중력과 기억력을 테스트하세요</p>

            <div className={styles.settings}>
                <div className={styles.settingItem}>
                <label>기억 단계: <span>{nBack}-Back</span></label>
                <input type="range" min="1" max="5" value={nBack} onChange={(e) => setNBack(Number(e.target.value))} />
                </div>
                <div className={styles.settingItem}>
                <label>문제 수: <span>{totalSteps}개</span></label>
                <input type="range" min="10" max="100" step="10" value={totalSteps} onChange={(e) => setTotalSteps(Number(e.target.value))} />
                </div>
                <div className={styles.settingItem}>
                <label>노출 속도: <span>{speed}초</span></label>
                <input type="range" min="1.0" max="4.0" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                </div>
            </div>

            <button onClick={handleStart} className={styles.startBtn}>훈련 시작</button>
            </div>

            <div className={styles.sideInfo}>
            <section className={styles.howTo}>
                <h3>How to Play</h3>
                <p>1. 화면에 나타나는 심볼을 순서대로 기억하세요.</p>
                <p>2. 현재 심볼이 <strong>{nBack}개 전</strong>의 것과 같으면 <strong>Space</strong>를 누르세요.</p>
                <p>3. 난이도가 높고 속도가 빠를수록 더 높은 점수를 얻습니다!</p>
            </section>

            <section className={styles.miniRank}>
                <h3>Today's Top 10</h3>
                <div className={styles.rankScroll}>
                {topRanking.length > 0 ? topRanking.map((r, i) => (
                    <div key={r.id} className={styles.rankRow}>
                    <span>{i + 1}. {r.nickname}</span>
                    <b>{r.score}</b>
                    </div>
                )) : <p className={styles.emptyText}>기록이 없습니다.</p>}
                </div>
                <button onClick={() => navigate('/ranking')} className={styles.moreBtn}>전체 순위 보기 →</button>
            </section>
            </div>
        </div>

        {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
        </div>
    );
    }