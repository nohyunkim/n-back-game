    // src/pages/Home.jsx
    import { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import styles from './Home.module.css';

    export default function Home() {
    const navigate = useNavigate();

    // 게임 설정 상태 관리
    const [nBack, setNBack] = useState(2);
    const [totalSteps, setTotalSteps] = useState(20);
    const [blockDuration, setBlockDuration] = useState(2000);

    // 게임 시작 버튼 클릭 시 설정값을 들고 Game 페이지로 이동
    const handleStart = () => {
        navigate('/game', {
        state: { nBack, totalSteps, blockDuration }
        });
    };

    return (
        <div className={styles.container}>
        <div className={styles.card}>
            <h1 className={styles.title}>도형 N-Back 훈련</h1>
            <p className={styles.subtitle}>작업 기억력 향상 프로그램</p>

            {/* 난이도 설정 */}
            <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>난이도 (N단계)</label>
            <div className={styles.numberControl}>
                <button className={styles.circleButton} onClick={() => setNBack(Math.max(1, nBack - 1))}>-</button>
                <span className={styles.levelText}>{nBack}</span>
                <button className={styles.circleButton} onClick={() => setNBack(nBack + 1)}>+</button>
            </div>
            </div>

            {/* 문제 수 설정 */}
            <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>
                문제 수 <span className={styles.valueText}>{totalSteps}개</span>
            </label>
            <input 
                type="range" 
                min="10" 
                max="50" 
                step="5" 
                value={totalSteps} 
                onChange={(e) => setTotalSteps(Number(e.target.value))}
                className={styles.rangeInput}
            />
            </div>

            {/* 도형 간격 설정 */}
            <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>
                도형 간격 <span className={styles.valueText}>{(blockDuration / 1000).toFixed(1)}초</span>
            </label>
            <input 
                type="range" 
                min="1000" 
                max="4000" 
                step="500" 
                value={blockDuration} 
                onChange={(e) => setBlockDuration(Number(e.target.value))}
                className={styles.rangeInput}
            />
            </div>

            <button onClick={handleStart} className={styles.startButton}>
            훈련 시작
            </button>
        </div>
        </div>
    );
    }