    import { Link } from 'react-router-dom';

    export default function Ranking() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>일일 랭킹</h2>
        {/* 파이어베이스에서 데이터를 불러와 띄워줄 예정 */}
        <Link to="/">
            <button style={{ marginTop: '20px' }}>처음 화면으로 돌아가기</button>
        </Link>
        </div>
    );
    }