    import { useState, useEffect, useRef, useCallback } from 'react';
    import { FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon } from 'react-icons/fa';

    const ALL_SHAPES = [FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon];
    const ALL_COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF', '#A020F0', '#FF9A76', '#00E0FF', '#F9F871'];

    // 정답 시퀀스를 미리 생성하는 함수
    const generateSequence = (totalSteps, nBack, symbolCount) => {
    const sequence = [];
    const targetMatchCount = Math.floor((totalSteps - nBack) * 0.3);
    const matchIndices = new Set();
    
    let consecutiveMatches = 0;
    for (let i = 0; i < targetMatchCount; i++) {
        let attempts = 0;
        while (attempts < 100) {
        const randIdx = Math.floor(Math.random() * (totalSteps - nBack)) + nBack;
        if (!matchIndices.has(randIdx)) {
            const isPrevMatch = matchIndices.has(randIdx - 1);
            if (isPrevMatch && consecutiveMatches >= 2) {
            attempts++;
            continue;
            }
            matchIndices.add(randIdx);
            consecutiveMatches = isPrevMatch ? consecutiveMatches + 1 : 1;
            break;
        }
        attempts++;
        }
    }

    const activeSymbols = [];
    for(let i = 0; i < symbolCount; i++) {
        activeSymbols.push({ shape: ALL_SHAPES[i], color: ALL_COLORS[i] });
    }

    for (let i = 0; i < totalSteps; i++) {
        if (matchIndices.has(i)) {
        sequence.push(sequence[i - nBack]);
        } else {
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
    const { nBack = 2, totalSteps = 30, blockDuration = 2000 } = config;
    const symbolCount = Math.min(nBack + 3, 8);

    const [gameState, setGameState] = useState('IDLE');
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [stats, setStats] = useState({ correct: 0, wrong: 0, miss: 0, totalReactionTime: 0, maxCombo: 0 });

    const engineRef = useRef({ sequence: [], matchIndices: new Set(), stepStartTime: 0, hasAnsweredThisStep: false });
    const timerRef = useRef(null);
    const stepRef = useRef(0); // 현재 진행 상황을 안전하게 추적하기 위한 ref 추가

    const calculateBaseScore = useCallback(() => {
        const speedMultiplier = (4000 / blockDuration); 
        return Math.round(10 * nBack * speedMultiplier);
    }, [nBack, blockDuration]);

    // 다음 스텝으로 넘어가는 로직
    const nextStep = useCallback((stepIdx) => {
        // 모든 문제를 다 풀었다면 FINISHED 상태로 변경
        if (stepIdx >= totalSteps) {
        setGameState('FINISHED');
        if (timerRef.current) clearInterval(timerRef.current);
        return;
        }

        // 아무 키도 누르지 않고 지나갔는데 그게 정답이었을 경우(놓침) 페널티
        if (stepIdx > 0 && engineRef.current.matchIndices.has(stepIdx - 1) && !engineRef.current.hasAnsweredThisStep) {
        setScore(s => s - Math.round(calculateBaseScore() / 2));
        setCombo(0);
        setStats(s => ({ ...s, miss: s.miss + 1 }));
        }

        engineRef.current.hasAnsweredThisStep = false;
        engineRef.current.stepStartTime = Date.now();
        setCurrentBlock(engineRef.current.sequence[stepIdx]);
        
        // ref와 state 모두 다음 스텝으로 업데이트
        stepRef.current = stepIdx + 1; 
        setCurrentStep(stepIdx + 1);
    }, [totalSteps, calculateBaseScore]);

    const startGame = useCallback(() => {
        const { sequence, matchIndices } = generateSequence(totalSteps, nBack, symbolCount);
        engineRef.current.sequence = sequence;
        engineRef.current.matchIndices = matchIndices;
        engineRef.current.hasAnsweredThisStep = false;
        setScore(0);
        setCombo(0);
        setStats({ correct: 0, wrong: 0, miss: 0, totalReactionTime: 0, maxCombo: 0 });
        
        stepRef.current = 0; // 시작 시 스텝 번호 초기화
        setCurrentStep(0);
        setGameState('PLAYING');
        nextStep(0); // 게임 시작과 동시에 첫 스텝 호출
    }, [totalSteps, nBack, symbolCount, nextStep]);

    useEffect(() => {
        if (gameState === 'PLAYING') {
        timerRef.current = setInterval(() => {
            // prev 상태를 받아오는 대신 ref의 최신 값을 직접 참조하여 무한 루프 버그 해결
            nextStep(stepRef.current);
        }, blockDuration);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, blockDuration, nextStep]);

    const handleInput = useCallback(() => {
        if (gameState !== 'PLAYING' || engineRef.current.hasAnsweredThisStep || currentStep <= nBack) return;

        engineRef.current.hasAnsweredThisStep = true;
        const isMatch = engineRef.current.matchIndices.has(currentStep - 1);
        const basePoints = calculateBaseScore();

        if (isMatch) {
        setCombo(c => {
            const newCombo = c + 1;
            const bonus = newCombo >= 5 ? basePoints * 0.5 : (newCombo >= 3 ? basePoints * 0.2 : 0);
            setScore(s => s + basePoints + Math.round(bonus));
            setStats(s => ({ ...s, correct: s.correct + 1, totalReactionTime: s.totalReactionTime + (Date.now() - engineRef.current.stepStartTime), maxCombo: Math.max(s.maxCombo, newCombo) }));
            return newCombo;
        });
        } else {
        setScore(s => s - Math.round(basePoints / 2));
        setCombo(0);
        setStats(s => ({ ...s, wrong: s.wrong + 1 }));
        }
    }, [gameState, currentStep, nBack, calculateBaseScore]);

    return { gameState, currentStep, totalSteps, score, combo, currentBlock, stats, blockDuration, startGame, handleInput };
    };