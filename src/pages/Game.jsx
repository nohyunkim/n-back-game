    // src/pages/Game.jsx
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { FaCircle, FaSquare, FaTimes, FaHexagon } from 'react-icons/fa'; 
    import styles from './Game.module.css'; 

    const COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF'];
    const SHAPES = [FaCircle, FaSquare, FaTimes, FaHexagon];

    export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();

    // Home에서 전달받은 설정값 적용 (없으면 기본값 사용)
    const { 
        nBack = 2, 
        totalSteps = 20, 
        blockDuration = 2000 
    } = location.state || {};

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [history, setHistory] = useState([]); 
    const [currentStep, setCurrentStep] = useState(0); 
    const [score, setScore] = useState(0);
    const [animateKey, setAnimateKey] = useState(0); 

    const timerRef = useRef(null); 

    const startGame = () => {
        setIsPlaying(true);
        setHistory([]);
        setScore(0);
        setCurrentStep(1); 
        nextBlock();
    };

    const nextBlock = () => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const newItem = { color: randomColor, shape: randomShape };
        
        setCurrentBlock(newItem);
        setHistory((prev) => [...prev, newItem]);
        setAnimateKey((prev) => prev + 1); 
    };

    const endGame = useCallback(() => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        alert(`훈련 종료! 최종 점수: ${score}점`);
        navigate('/ranking'); 
    }, [score, navigate]);

    useEffect(() => {
        if (isPlaying) {
        timerRef.current = setInterval(() => {
            if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
            nextBlock();
            } else {
            endGame();
            }
        }, blockDuration);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, currentStep, totalSteps, blockDuration, endGame]);

    // 일치 판별 함수
    const handleMatchClick = useCallback(() => {
        if (!isPlaying || currentStep <= nBack) return; 

        const targetBlock = history[history.length - 1 - nBack];
        
        if (currentBlock.color === targetBlock.color && currentBlock.shape === targetBlock.shape) {
        setScore((prev) => prev + 10); 
        setAnimateKey((prev) => prev + 1); 
        } else {
        setScore((prev) => prev - 5);  
        }
    }, [isPlaying, currentStep, nBack, history, currentBlock]);

    // 스페이스바 키보드 이벤트 연동
    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // 스페이스바로 화면이 아래로 스크롤되는 현상 방지
            handleMatchClick();
        }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMatchClick]);

    return (
        <div className={styles.container}>
        <div className={styles.backLink} onClick={() => navigate('/')}>
            ← 처음 화면
        </div>

        <div className={styles.card}>
            <h1 className={styles.title}>도형 N-Back 훈련</h1>
            <p className={styles.subtitle}>작업 기억력 향상 프로그램</p>

            <div className={styles.infoRow}>
            <span>진행: {isPlaying ? `${currentStep} / ${totalSteps}` : `0 / ${totalSteps}`}</span>
            <span>레벨: {nBack}-Back</span>
            </div>

            <div className={styles.shapeBoard}>
            {currentBlock ? (
                <div key={animateKey} className={styles.shapeWrapper}>
                <currentBlock.shape size="120" color={currentBlock.color} />
                </div>
            ) : (
                <span className={styles.waitingText}>대기 중</span>
            )}
            </div>

            {isPlaying && (
                <p className={styles.scoreText}>점수: {score}</p>
            )}

            {!isPlaying ? (
            <button onClick={startGame} className={styles.actionButton}>
                훈련 시작
            </button>
            ) : (
            <button 
                onClick={handleMatchClick} 
                className={`${styles.actionButton} ${currentStep <= nBack ? styles.disabledButton : ''}`}
            >
                일치 (Space)
            </button>
            )}
        </div>
        </div>
    );
    }