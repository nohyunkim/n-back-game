    // src/pages/Game.jsx
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { FaCircle, FaSquare, FaTimes, FaStar } from 'react-icons/fa'; 
    import { useAuth } from '../contexts/AuthContext'; 
    import { saveScore } from '../services/rankingApi'; 
    import styles from './Game.module.css'; 

    const COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF'];
    const SHAPES = [FaCircle, FaSquare, FaTimes, FaStar];

    export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, nickname } = useAuth(); 

    // 이전 페이지에서 전달받은 커스텀 설정값
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
        if (!currentUser) {
        alert('기록을 저장하려면 로그인이 필요합니다.');
        navigate('/'); 
        return;
        }
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

    const endGame = useCallback(async () => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        
        // 최종 데이터베이스 저장 로직
        const userData = {
        uid: currentUser.uid,
        nickname: nickname,
        photoURL: currentUser.photoURL
        };
        
        await saveScore(userData, score, nBack);
        alert(`게임 종료! 최종 점수: ${score}점`);
        navigate('/ranking'); 
    }, [score, nBack, currentUser, nickname, navigate]);

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

    const handleMatchClick = useCallback(() => {
        if (!isPlaying || currentStep <= nBack) return; 

        const targetBlock = history[history.length - 1 - nBack];
        
        // 모양과 색상이 동시에 일치하는지 비교
        if (currentBlock.color === targetBlock.color && currentBlock.shape === targetBlock.shape) {
        setScore((prev) => prev + 10); 
        setAnimateKey((prev) => prev + 1); 
        } else {
        setScore((prev) => prev - 5);  
        }
    }, [isPlaying, currentStep, nBack, history, currentBlock]);

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); 
            handleMatchClick();
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMatchClick]);

    return (
        <div className={styles.container}>
        <div className={styles.backLink} onClick={() => navigate('/')}>
            ← 처음 화면으로 돌아가기
        </div>

        <div className={styles.card}>
            <h1 className={styles.title}>N-Back Training</h1>
            <p className={styles.subtitle}>도형과 색상을 기억하세요</p>

            <div className={styles.infoRow}>
            <span>PROGRESS: {isPlaying ? `${currentStep}/${totalSteps}` : `0/${totalSteps}`}</span>
            <span>LEVEL: {nBack}-Back</span>
            </div>

            <div className={styles.shapeBoard}>
            {currentBlock ? (
                <div key={animateKey} className={styles.shapeWrapper}>
                {/* 아이콘 크기를 100으로 살짝 키워 밸런스 조정 */}
                <currentBlock.shape size="100" color={currentBlock.color} />
                </div>
            ) : (
                <span style={{color: '#475569'}}>READY</span>
            )}
            </div>

            {isPlaying && <p className={styles.scoreText}>{score} PTS</p>}

            {!isPlaying ? (
            <button onClick={startGame} className={styles.actionButton}>
                훈련 시작하기
            </button>
            ) : (
            <button 
                onClick={handleMatchClick} 
                className={`${styles.actionButton} ${currentStep <= nBack ? styles.disabledButton : ''}`}
                disabled={currentStep <= nBack}
            >
                일치 (Space)
            </button>
            )}
        </div>
        </div>
    );
    }