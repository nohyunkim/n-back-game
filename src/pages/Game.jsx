    // src/pages/Game.jsx
    import { useState, useEffect, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { FaCircle, FaSquare, FaTimes, FaHexagon } from 'react-icons/fa'; 
    import styles from './Game.module.css'; // 분리한 CSS Module 불러오기

    const COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF'];
    const SHAPES = [FaCircle, FaSquare, FaTimes, FaHexagon];

    export default function Game() {
    const navigate = useNavigate();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [history, setHistory] = useState([]); 
    const [currentStep, setCurrentStep] = useState(0); 
    const [score, setScore] = useState(0);
    const [animateKey, setAnimateKey] = useState(0); 

    const nBack = 2; 
    const totalSteps = 20; 
    const blockDuration = 2000; 
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
    }, [isPlaying, currentStep]);

    const endGame = () => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        alert(`훈련 종료! 점수: ${score}`);
        navigate('/ranking'); 
    };

    const handleMatchClick = () => {
        if (!isPlaying || currentStep <= nBack) return; 

        const targetBlock = history[history.length - 1 - nBack];
        
        if (currentBlock.color === targetBlock.color && currentBlock.shape === targetBlock.shape) {
        setScore((prev) => prev + 10); 
        setAnimateKey((prev) => prev + 1); 
        } else {
        setScore((prev) => prev - 5);  
        }
    };

    return (
        <div className={styles.container}>
        <div className={styles.backLink} onClick={() => navigate('/')}>
            ← 처음 화면
        </div>

        <div className={styles.card}>
            <h1 className={styles.title}>도형 N-Back 훈련</h1>
            <p className={styles.subtitle}>작업 기억력 향상 프로그램</p>

            <div className={styles.infoRow}>
            <span>진행: {isPlaying ? `${currentStep} / ${totalSteps}` : '0 / 20'}</span>
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
                // N번째 전까지는 비활성화 스타일 적용
                className={`${styles.actionButton} ${currentStep <= nBack ? styles.disabledButton : ''}`}
            >
                일치 (Space)
            </button>
            )}
        </div>
        </div>
    );
    }