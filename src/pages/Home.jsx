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
    const [isHowToFlipped, setIsHowToFlipped] = useState(false);
    const [topRanking, setTopRanking] = useState([]);

    const [nBack, setNBack] = useState(2);
    const [totalSteps, setTotalSteps] = useState(20); // 초기값을 20으로 변경
    const [speed, setSpeed] = useState(2.0);

    useEffect(() => {
        getDailyRanking().then(data => setTopRanking(data.slice(0, 3)));
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
                {/* max 범위를 50으로 수정 */}
                <input type="range" min="10" max="50" step="10" value={totalSteps} onChange={(e) => setTotalSteps(Number(e.target.value))} />
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
                <div className={`${styles.howToInner} ${isHowToFlipped ? styles.howToFlipped : ''}`}>
                <div className={`${styles.howToFace} ${styles.howToFront}`}>
                    <div className={styles.howToContent}>
                    <h3>How to Play</h3>
                    <p><strong>지금 도형</strong>이 <strong>{nBack}개 전</strong> 도형과 같을 때만 <strong>Space 또는 버튼</strong>을 누르세요.</p>
                    <p><strong>처음 {nBack}개</strong>는 비교할 수 없으니 누르지 말고 기억만 하면 됩니다.</p>
                    <p><strong>다르면 누르지 않기.</strong> 이 한 가지만 기억하면 바로 시작할 수 있어요.</p>
                    </div>
                    <button
                        type="button"
                        className={styles.flipButton}
                        onClick={() => setIsHowToFlipped(true)}
                    >
                        예시 보기
                    </button>
                </div>

                <div className={`${styles.howToFace} ${styles.howToBack}`}>
                    <div className={styles.howToContent}>
                    <h3>{nBack}-Back Example</h3>
                    <p className={styles.exampleLine}>예시 순서: ● → ▲ → ● → ■</p>
                    <p>
                        <strong>2-Back 기준</strong>에서는 3번째 ●가 2칸 전의 ●와 같으므로 그 순간 누르면 됩니다.
                    </p>
                    <p>
                        지금 선택한 <strong>{nBack}-Back</strong>은 항상 <strong>{nBack}칸 전</strong> 도형과 비교한다고 생각하면 돼요.
                    </p>
                    </div>
                    <button
                        type="button"
                        className={styles.flipButton}
                        onClick={() => setIsHowToFlipped(false)}
                    >
                        규칙 다시 보기
                    </button>
                </div>
                </div>
            </section>

            <section className={styles.miniRank}>
                <h3>Today's Top 3</h3>
                <div className={styles.rankList}>
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
