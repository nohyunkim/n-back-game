    // src/hooks/useNBackEngine.js
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon } from 'react-icons/fa';

    // 난이도에 따른 심볼 풀(Pool) 확장 (초급 4개, 중급 6개, 고급 8개)
    const ALL_SHAPES = [FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon];
    const ALL_COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF', '#A020F0', '#FF9A76', '#00E0FF', '#F9F871'];

    /**
     * 공정한 랜덤 시퀀스 생성 알고리즘 (연속 정답 방지, 밸런스 조절)
     */
    const generateSequence = (totalSteps, nBack, symbolCount) => {
    const sequence = [];
    const targetMatchCount = Math.floor((totalSteps - nBack) * 0.3); // 정답률 30% 고정
    const matchIndices = new Set();
    
    // 정답 인덱스 뽑기 (조건: 최소 간격 유지, 연속 정답 2회 이하)
    let consecutiveMatches = 0;
    for (let i = 0; i < targetMatchCount; i++) {
        let attempts = 0;
        while (attempts < 100) {
        // nBack 이후부터 정답 가능
        const randIdx = Math.floor(Math.random() * (totalSteps - nBack)) + nBack;
        if (!matchIndices.has(randIdx)) {
            // 이전 스텝이 정답이었는지 확인 (연속 정답 제어)
            const isPrevMatch = matchIndices.has(randIdx - 1);
            if (isPrevMatch && consecutiveMatches >= 2) {
            attempts++;
            continue; // 3연속 정답 방지
            }
            matchIndices.add(randIdx);
            consecutiveMatches = isPrevMatch ? consecutiveMatches + 1 : 1;
            break;
        }
        attempts++;
        }
    }

    // 사용될 심볼과 색상 묶음 고정 생성 (난이도별 4~8개)
    const activeSymbols = [];
    for(let i=0; i<symbolCount; i++) {
        activeSymbols.push({ shape: ALL_SHAPES[i], color: ALL_COLORS[i] });
    }

    // 시퀀스 조립
    for (let i = 0; i < totalSteps; i++) {
        if (matchIndices.has(i)) {
        sequence.push(sequence[i - nBack]); // 정답: N개 전과 완벽히 동일
        } else {
        // 오답: N개 전과 무조건 달라야 함
        let randomSymbol;
        do {
            randomSymbol = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
        } while (i >= nBack && randomSymbol.shape === sequence[i - nBack].shape);
        sequence.push(randomSymbol);
        }
    }
    return { sequence, matchIndices };
    };

    export const useNBackEngine = (config) => {
    const { nBack = 2, totalSteps = 30, blockDuration = 2000, symbolCount = 4 } = config;

    // 상태 머신: IDLE -> PLAYING -> FINISHED
    const [gameState, setGameState] = useState('IDLE');
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    
    const [currentBlock, setCurrentBlock] = useState(null);
    
    // 통계 데이터
    const [stats, setStats] = useState({
        correct: 0,
        wrong: 0,
        miss: 0,
        totalReactionTime: 0,
        maxCombo: 0
    });

    const engineRef = useRef({
        sequence: [],
        matchIndices: new Set(),
        stepStartTime: 0,
        hasAnsweredThisStep: false, // 연타 방지 플래그
    });

    const timerRef = useRef(null);

    const startGame = useCallback(() => {
        const { sequence, matchIndices } = generateSequence(totalSteps, nBack, symbolCount);
        engineRef.current.sequence = sequence;
        engineRef.current.matchIndices = matchIndices;
        engineRef.current.hasAnsweredThisStep = false;
        
        setScore(0);
        setCombo(0);
        setStats({ correct: 0, wrong: 0, miss: 0, totalReactionTime: 0, maxCombo: 0 });
        setCurrentStep(0);
        setGameState('PLAYING');
        nextStep(0);
    }, [totalSteps, nBack, symbolCount]);

    const nextStep = useCallback((stepIdx) => {
        if (stepIdx >= totalSteps) {
        setGameState('FINISHED');
        return;
        }

        // 이전 스텝에서 정답이었는데 안 누르고 넘어왔다면 (Miss 처리)
        if (stepIdx > 0) {
        const prevStep = stepIdx - 1;
        const wasMatch = engineRef.current.matchIndices.has(prevStep);
        const didAnswer = engineRef.current.hasAnsweredThisStep;
        
        if (wasMatch && !didAnswer) {
            setScore(s => s - 5);
            setCombo(0); // 콤보 초기화
            setStats(s => ({ ...s, miss: s.miss + 1 }));
        }
        }

        // 다음 스텝 세팅
        engineRef.current.hasAnsweredThisStep = false;
        engineRef.current.stepStartTime = Date.now();
        setCurrentBlock(engineRef.current.sequence[stepIdx]);
        setCurrentStep(stepIdx + 1);
    }, [totalSteps]);

    // 메인 게임 루프 (타이머)
    useEffect(() => {
        if (gameState === 'PLAYING') {
        timerRef.current = setInterval(() => {
            setCurrentStep((prev) => {
            nextStep(prev);
            return prev; 
            });
        }, blockDuration);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, blockDuration, nextStep]);

    // 유저 입력 처리 (키보드 or 버튼)
    const handleInput = useCallback(() => {
        if (gameState !== 'PLAYING') return;
        
        const stepIdx = currentStep - 1;
        // 1. 초반 N스텝 입력 무시 (패널티 없음)
        if (stepIdx < nBack) return; 
        // 2. 연타 방지 (이미 눌렀으면 무시)
        if (engineRef.current.hasAnsweredThisStep) return;

        engineRef.current.hasAnsweredThisStep = true;
        const reactionTime = Date.now() - engineRef.current.stepStartTime;
        const isMatch = engineRef.current.matchIndices.has(stepIdx);

        if (isMatch) {
        // 정답 (Hit)
        setCombo(c => {
            const newCombo = c + 1;
            setStats(s => ({ ...s, correct: s.correct + 1, totalReactionTime: s.totalReactionTime + reactionTime, maxCombo: Math.max(s.maxCombo, newCombo) }));
            
            // 콤보 보너스 시스템
            let bonus = 0;
            if (newCombo >= 5) bonus = 5;
            else if (newCombo >= 3) bonus = 2;
            
            setScore(s => s + 10 + bonus);
            return newCombo;
        });
        } else {
        // 오답 (False Alarm)
        setScore(s => s - 5);
        setCombo(0);
        setStats(s => ({ ...s, wrong: s.wrong + 1 }));
        }
    }, [gameState, currentStep, nBack]);

    return {
        gameState,
        currentStep,
        totalSteps,
        score,
        combo,
        currentBlock,
        stats,
        blockDuration,
        startGame,
        handleInput
    };
    };