    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Home from './pages/Home';
    import Game from './pages/Game';
    import Ranking from './pages/Ranking';
    import TrainingGuide from './pages/TrainingGuide';
    import NBackPrinciples from './pages/NBackPrinciples';
    import SitePolicy from './pages/SitePolicy';

    function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/guide" element={<TrainingGuide />} />
            <Route path="/about-nback" element={<NBackPrinciples />} />
            <Route path="/policy" element={<SitePolicy />} />
        </Routes>
        </BrowserRouter>
    );
    }

    export default App;