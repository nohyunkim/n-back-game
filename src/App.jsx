    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Home from './pages/Home';
    import Game from './pages/Game';
    import Ranking from './pages/Ranking';

    function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/ranking" element={<Ranking />} />
        </Routes>
        </BrowserRouter>
    );
    }

    export default App;