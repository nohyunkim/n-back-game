    import { Link } from 'react-router-dom';

    export default function Home() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>N-Back 훈련소</h1>
        <p>작업 기억력 향상 프로그램</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <Link to="/game">
            <button style={{ padding: '10px 20px', fontSize: '16px' }}>훈련 시작</button>
            </Link>
            <Link to="/ranking">
            <button style={{ padding: '10px 20px', fontSize: '16px' }}>랭킹 보기</button>
            </Link>
        </div>
        </div>
    );
    }