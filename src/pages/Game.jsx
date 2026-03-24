    // src/pages/Game.jsx
    import { useEffect, useState } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext'; 
    import { saveScore } from '../services/rankingApi'; 
    import { useNBackEngine } from '../hooks/useNBackEngine';
    import styles from './Game.module.css'; 

    export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, nickname } = useAuth(); 

    // 난이도에 따른 심볼 갯수 연동 (예: nBack이 높을수록 심볼도 많아짐)
    const nBack = location.state?.nBack || 2;
    const totalSteps = location.state?.totalSteps || 30;
    const symbolCount = nBack === 2 ? 4 : nBack === 3 ? 6 : 8; 
    const blockDuration = 2000;

    const {
        gameState, currentStep, score, combo, currentBlock, stats, 
        startGame, handleInput
    } = useNBackEngine({ nBack, totalSteps, blockDuration, symbolCount });

    // 게임 종료 시 DB 저장 및 결과 화면 전환
    useEffect(() => {
        if (gameState === 'FINISHED' && currentUser) {
        const saveAndFinish = async () => {
            const userData = { uid: currentUser.uid, nickname, photoURL: currentUser.photoURL };
            await saveScore(userData, score, nBack);
        };
        saveAndFinish();
        }
    }, [gameState, currentUser, nickname, score, nBack]);

    // 스페이스바 이벤트 바인딩
    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); 
            handleInput();
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleInput]);

    // 타이머 바 애니메이션 제어용
    const [timerKey, setTimerKey] = useState(0);
    useEffect(() => {
        if (currentStep > 0) setTimerKey(prev => prev + 1);
    }, [currentStep]);

    const isEarlyStep = currentStep <= nBack;

    if (gameState === 'FINISHED') {
        const avgRt = stats.correct > 0 ? Math.round(stats.totalReactionTime / stats.correct) : 0;
        const accuracy = Math.round((stats.correct / (stats.correct + stats.wrong + stats.miss)) * 100) || 0;

        return (
        <div className={styles.container}>
            <div className={styles.resultCard}>
            <h1 className={styles.title}>훈련 완료</h1>
            <div className={styles.scoreBoard}>
                <h2>최종 점수: <span className={styles.highlight}>{score}</span> PTS</h2>
                <p>최대 연속 정답: {stats.maxCombo} 콤보</p>
                <p>평균 반응 속도: {avgRt} ms</p>
                <p>정확도: {accuracy} %</p>
                <hr className={styles.divider} />
                <p className={styles.detailStats}>
                정답: {stats.correct} | 오답: {stats.wrong} | 놓침: {stats.miss}
                </p>
            </div>
            <div className={styles.btnGroup}>
                <button onClick={startGame} className={styles.actionButton}>다시 하기</button>
                <button onClick={() => navigate('/ranking')} className={styles.secondaryButton}>랭킹 보기</button>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className={styles.container}>
        <div className={styles.backLink} onClick={() => navigate('/')}>
            ← 종료하고 나가기
        </div>

        <div className={styles.card}>
            <div className={styles.header}>
            <div>
                <span className={styles.levelBadge}>{nBack}-BACK</span>
                <span className={styles.stepInfo}>{currentStep} / {totalSteps}</span>
            </div>
            <div className={styles.scoreInfo}>
                <span className={styles.score}>{score} PTS</span>
                {combo >= 3 && <span className={styles.comboBadge}>{combo} COMBO 🔥</span>}
            </div>
            </div>

            {/* 타이머 게이지 바 */}
            <div className={styles.timerTrack}>
            {gameState === 'PLAYING' && (
                <div 
                key={timerKey} 
                className={styles.timerThumb} 
                style={{ animationDuration: `${blockDuration}ms` }} 
                />
            )}
            </div>

            <div className={styles.shapeBoard}>
            {gameState === 'PLAYING' && currentBlock ? (
                <div className={styles.shapeWrapper}>
                {isEarlyStep && <div className={styles.earlyWarning}>눈으로만 기억하세요!</div>}
                <currentBlock.shape size="100" color={currentBlock.color} className={styles.popAnim} />
                </div>
            ) : (
                <span className={styles.readyText}>READY</span>
            )}
            </div>

            {gameState === 'IDLE' ? (
            <button onClick={startGame} className={styles.actionButton}>
                훈련 시작하기
            </button>
            ) : (
            <button 
                onClick={handleInput} 
                className={`${styles.actionButton} ${isEarlyStep ? styles.disabledButton : ''}`}
                disabled={isEarlyStep}
            >
                {isEarlyStep ? '기억하는 중...' : '일치 (Space)'}
            </button>
            )}
        </div>
        </div>
    );
    }