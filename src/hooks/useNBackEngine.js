    // src/hooks/useNBackEngine.js
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon } from 'react-icons/fa';

    // 난이도(symbolCount)에 따라 사용할 모양과 색상 풀
    const ALL_SHAPES = [FaCircle, FaSquare, FaTimes, FaStar, FaHeart, FaPlay, FaGem, FaMoon];
    const ALL_COLORS = ['#FF4D4D', '#FFC93C', '#6BCB77', '#4D96FF', '#A020F0', '#FF9A76', '#00E0FF', '#F9F871'];

    /**
     * 공정한 랜덤 시퀀스 생성 알고리즘
     * @param {number} totalSteps - 총 문제 수
     * @param {number} nBack - N-back 단계
     * @param {number} symbolCount - 사용할 심볼 종류 수 (난이도)
     */
    const generateSequence = (totalSteps, nBack, symbolCount) => {
    const sequence = [];
    const targetMatchCount = Math.floor((totalSteps - nBack) * 0.3); // 정답률 30% 고정
    const matchIndices = new Set();
    
    // 1. 정답이 위치할 인덱스 미리 결정 (연속 정답 최대 2회 제한)
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

    // 2. 난이도별 사용할 심볼 고정 생성
    const activeSymbols = [];
    for(let i = 0; i < symbolCount; i++) {
        activeSymbols.push({ shape: ALL_SHAPES[i], color: ALL_COLORS[i] });
    }

    // 3. 실제 시퀀스 조립
    for (let i = 0; i < totalSteps; i++) {
        if (matchIndices.has(i)) {
        sequence.push(sequence[i - nBack]); // 정답 배치
        } else {
        let randomSymbol;
        do {
            randomSymbol = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
        } while (i >= nBack && randomSymbol.shape === sequence[i - nBack].shape); // 오답 보장
        sequence.push(randomSymbol);
        }
    }
    return { sequence, matchIndices };
    };

    export const useNBackEngine = (config) => {
    const { nBack = 2, totalSteps = 30, blockDuration = 2000, symbolCount = 4 } = config;

    const [gameState, setGameState] = useState('IDLE');
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [currentBlock, setCurrentBlock] = useState(null);
    
    // 통계 데이터 (정확도 및 반응 속도 계산용)
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
        hasAnsweredThisStep: false,
    });

    const timerRef = useRef(null);

    // 게임 시작 함수
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
        nextStep(0); // 첫 번째 스텝 실행
    }, [totalSteps, nBack, symbolCount]);

    // 다음 문제로 넘어가는 핵심 로직
    const nextStep = useCallback((stepIdx) => {
        // [수정된 부분] 종료 조건: 설정된 문제 수에 도달하면 게임 종료
        if (stepIdx >= totalSteps) {
        setGameState('FINISHED');
        if (timerRef.current) clearInterval(timerRef.current);
        return;
        }

        // Miss 판정: 이전 스텝이 정답이었는데 유저가 입력하지 않았다면 감점
        if (stepIdx > 0) {
        const prevStep = stepIdx - 1;
        const wasMatch = engineRef.current.matchIndices.has(prevStep);
        const didAnswer = engineRef.current.hasAnsweredThisStep;
        
        if (wasMatch && !didAnswer) {
            setScore(s => s - 5);
            setCombo(0);
            setStats(s => ({ ...s, miss: s.miss + 1 }));
        }
        }

        // 현재 스텝 정보 업데이트
        engineRef.current.hasAnsweredThisStep = false;
        engineRef.current.stepStartTime = Date.now();
        setCurrentBlock(engineRef.current.sequence[stepIdx]);
        setCurrentStep(stepIdx + 1);
    }, [totalSteps]);

    // 타이머 루프
    useEffect(() => {
        if (gameState === 'PLAYING') {
        timerRef.current = setInterval(() => {
            // setCurrentStep의 함수형 업데이트를 이용해 항상 최신 stepIdx를 참조
            setCurrentStep((prev) => {
            nextStep(prev);
            return prev; 
            });
        }, blockDuration);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, blockDuration, nextStep]);

    // 유저 입력 처리 (스페이스바/클릭)
    const handleInput = useCallback(() => {
        if (gameState !== 'PLAYING') return;
        
        const stepIdx = currentStep - 1;
        if (stepIdx < nBack) return; // 초반 N개 구간은 정답이 존재할 수 없으므로 무시
        if (engineRef.current.hasAnsweredThisStep) return; // 중복 입력 방지

        engineRef.current.hasAnsweredThisStep = true;
        const reactionTime = Date.now() - engineRef.current.stepStartTime;
        const isMatch = engineRef.current.matchIndices.has(stepIdx);

        if (isMatch) {
        // 정답 처리 및 콤보 보너스
        setCombo(c => {
            const newCombo = c + 1;
            const bonus = newCombo >= 5 ? 5 : (newCombo >= 3 ? 2 : 0);
            setScore(s => s + 10 + bonus);
            setStats(s => ({ 
            ...s, 
            correct: s.correct + 1, 
            totalReactionTime: s.totalReactionTime + reactionTime, 
            maxCombo: Math.max(s.maxCombo, newCombo) 
            }));
            return newCombo;
        });
        } else {
        // 오답 처리
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