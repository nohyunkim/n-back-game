    import { Link } from 'react-router-dom';

    export default function Game() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>게임 화면</h2>
        {/* 여기에 도형 노출과 게임 로직이 들어갈 예정 */}
        <Link to="/">
            <button style={{ marginTop: '20px' }}>처음 화면으로 돌아가기</button>
        </Link>
        </div>
    );
    }