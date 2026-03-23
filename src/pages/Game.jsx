    import { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    // 깔끔한 도형 아이콘 4가지 불러오기
    import { FaCircle, FaSquare, FaStar, FaHeart } from 'react-icons/fa'; 

    // 사용할 색상 4가지 (빨, 노, 초, 파)와 도형 배열
    const COLORS = ['#FF0000', '#FFD700', '#008000', '#0000FF'];
    const SHAPES = [FaCircle, FaSquare, FaStar, FaHeart];

    export default function Game() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [history, setHistory] = useState([]); // 이제 여기에 { color, shape } 객체가 쌓임
    const [score, setScore] = useState(0);

    const nBack = 2; 

    const startGame = () => {
        setIsPlaying(true);
        setHistory([]);
        setScore(0);
        nextBlock();
    };

    const nextBlock = () => {
        // 무작위로 색상과 도형을 하나씩 선택
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        
        // 선택된 데이터를 객체 형태로 묶음
        const newItem = { color: randomColor, shape: randomShape };
        
        setCurrentBlock(newItem);
        setHistory((prev) => [...prev, newItem]);
    };

    useEffect(() => {
        let timer;
        if (isPlaying) {
        // 2초마다 다음 도형 생성
        timer = setInterval(() => {
            nextBlock();
        }, 2000);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    const handleMatchClick = () => {
        if (history.length <= nBack) return; 

        // N번째 전의 객체 데이터 가져오기
        const targetBlock = history[history.length - 1 - nBack];
        
        // 색상과 도형이 '모두' 같아야 정답 처리
        if (currentBlock.color === targetBlock.color && currentBlock.shape === targetBlock.shape) {
        setScore((prev) => prev + 10);
        } else {
        setScore((prev) => prev - 5);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>N-Back 훈련 (현재: {nBack}-Back)</h2>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>점수: {score}</p>

        {/* 도형과 색상이 렌더링되는 영역 */}
        <div
            style={{
            width: '150px',
            height: '150px',
            margin: '30px auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '15px'
            }}
        >
            {currentBlock ? (
            // 선택된 컴포넌트를 렌더링하고, 색상 속성을 부여
            <currentBlock.shape size="100" color={currentBlock.color} />
            ) : (
            <span style={{ color: '#ccc' }}>대기 중</span>
            )}
        </div>

        {!isPlaying ? (
            <button onClick={startGame} style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}>
            게임 시작
            </button>
        ) : (
            <button onClick={handleMatchClick} style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}>
            모양과 색상이 {nBack}번째 전과 같음!
            </button>
        )}

        <div style={{ marginTop: '40px' }}>
            <Link to="/">
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>처음 화면으로</button>
            </Link>
        </div>
        </div>
    );
    }