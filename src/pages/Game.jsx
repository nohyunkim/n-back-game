    import { useState, useEffect, useRef, useCallback } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { FaCircle, FaSquare, FaTimes, FaHexagon } from 'react-icons/fa'; 
    import { useAuth } from '../contexts/AuthContext'; // 로그인 정보 공유를 위한 훅 추가
    import styles from './Game.module.css'; 

    // 사용할 색상 및 도형 리스트
    const COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF'];
    const SHAPES = [FaCircle, FaSquare, FaTimes, FaHexagon];

    export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth(); // 현재 로그인된 유저 정보 가져오기

    // Home에서 전달받은 설정값 적용 (없으면 기본값 사용)
    const { 
        nBack = 2, 
        totalSteps = 20, 
        blockDuration = 2000 
    } = location.state || {};

    // --- 게임 내부 상태 ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [history, setHistory] = useState([]); 
    const [currentStep, setCurrentStep] = useState(0); 
    const [score, setScore] = useState(0);
    const [animateKey, setAnimateKey] = useState(0); 

    const timerRef = useRef(null); 

    // --- 함수: 게임 시작 (로그인 체크 포함) ---
    const startGame = () => {
        // 1. 로그인 여부 확인
        if (!currentUser) {
        alert('훈련 기록을 남기려면 먼저 로그인해 주세요.');
        navigate('/'); // 로그인이 안 되어 있으면 홈으로 돌려보냄
        return;
        }

        // 2. 게임 데이터 초기화 및 시작
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
        setAnimateKey((prev) => prev + 1); // 깜빡임 애니메이션 트리거
    };

    // --- 함수: 게임 종료 ---
    const endGame = useCallback(() => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        alert(`훈련 종료! 최종 점수: ${score}점`);
        // 추후 여기에 점수를 DB에 저장하는 로직이 추가될 예정이야
        navigate('/ranking'); 
    }, [score, navigate]);

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

    // --- 함수: '일치' 판별 로직 ---
    const handleMatchClick = useCallback(() => {
        if (!isPlaying || currentStep <= nBack) return; 

        const targetBlock = history[history.length - 1 - nBack];
        
        // 색상과 모양이 모두 일치하는지 확인
        if (currentBlock.color === targetBlock.color && currentBlock.shape === targetBlock.shape) {
        setScore((prev) => prev + 10); 
        setAnimateKey((prev) => prev + 1); 
        } else {
        setScore((prev) => prev - 5);  
        }
    }, [isPlaying, currentStep, nBack, history, currentBlock]);

    // --- 효과: 스페이스바 키보드 이벤트 ---
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
        {/* 상단 네비게이션 */}
        <div className={styles.backLink} onClick={() => navigate('/')}>
            ← 처음 화면
        </div>

        <div className={styles.card}>
            <h1 className={styles.title}>도형 N-Back 훈련</h1>
            <p className={styles.subtitle}>작업 기억력 향상 프로그램</p>

            {/* 진행 정보 영역 */}
            <div className={styles.infoRow}>
            <span>진행: {isPlaying ? `${currentStep} / ${totalSteps}` : `0 / ${totalSteps}`}</span>
            <span>레벨: {nBack}-Back</span>
            </div>

            {/* 도형 노출 보드 */}
            <div className={styles.shapeBoard}>
            {currentBlock ? (
                <div key={animateKey} className={styles.shapeWrapper}>
                <currentBlock.shape size="120" color={currentBlock.color} />
                </div>
            ) : (
                <span className={styles.waitingText}>대기 중</span>
            )}
            </div>

            {/* 실시간 점수 표시 */}
            {isPlaying && (
                <p className={styles.scoreText}>점수: {score}</p>
            )}

            {/* 조작 버튼 영역 */}
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