import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import GamePage from './pages/GamePage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;