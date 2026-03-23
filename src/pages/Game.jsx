    import { useState, useEffect, useRef, useCallback } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { FaCircle, FaSquare, FaTimes, FaStar } from 'react-icons/fa'; 
    import { useAuth } from '../contexts/AuthContext'; 
    import { saveScore } from '../services/rankingApi'; // 점수 저장 API 추가
    import styles from './Game.module.css'; 

    // 사용할 색상 및 도형 리스트
    const COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF'];
    const SHAPES = [FaCircle, FaSquare, FaTimes, FaStar];

    export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, nickname } = useAuth(); // 로그인 유저 정보 및 별명 가져오기

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

    // --- 함수: 게임 시작 ---
    const startGame = () => {
        if (!currentUser) {
        alert('훈련 기록을 남기려면 먼저 로그인해 주세요.');
        navigate('/'); 
        return;
        }

        setIsPlaying(true);
        setHistory([]);
        setScore(0);
        setCurrentStep(1); 
        nextBlock();
    };

    // --- 함수: 다음 블록 생성 ---
    const nextBlock = () => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const newItem = { color: randomColor, shape: randomShape };
        
        setCurrentBlock(newItem);
        setHistory((prev) => [...prev, newItem]);
        setAnimateKey((prev) => prev + 1); 
    };

    // --- 함수: 게임 종료 및 점수 저장 ---
    const endGame = useCallback(async () => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        
        // 점수 저장 데이터 구성
        const userData = {
        uid: currentUser.uid,
        nickname: nickname, // 현재 설정된 별명 사용
        photoURL: currentUser.photoURL
        };
        
        // DB 저장 호출 (비동기 처리)
        await saveScore(userData, score, nBack);
        
        alert(`훈련 종료! 최종 점수: ${score}점\n랭킹에 등록되었습니다.`);
        navigate('/ranking'); 
    }, [score, nBack, currentUser, nickname, navigate]);

    // --- 효과: 게임 진행 타이머 ---
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

    // --- 함수: 일치 판별 (Space) ---
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

    // --- 효과: 키보드 이벤트 리스너 ---
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