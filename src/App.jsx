import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import CustomCursor from './components/layout/CustomCursor';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Games from './components/sections/Games';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Scene3D from './components/three/Scene3D';
import AsteroidDodge from './games/three/AsteroidDodge';
import MarbleRun from './games/three/MarbleRun';
import Memory3D from './games/three/Memory3D';
import OrbitCatch from './games/three/OrbitCatch';

const gameComponents = {
  'marble-run': MarbleRun,
  'asteroid-dodge': AsteroidDodge,
  'memory-3d': Memory3D,
  'orbit-catch': OrbitCatch,
};

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <>
      {/* Fixed 3D background behind everything */}
      <Scene3D />

      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Games onPlayGame={setActiveGame} />
        <Contact />
      </main>

      <AnimatePresence>
        {activeGame && (() => {
          const GameComponent = gameComponents[activeGame];
          return GameComponent ? (
            <motion.div
              key="game-overlay"
              className="fixed inset-0 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameComponent onExit={() => setActiveGame(null)} />
            </motion.div>
          ) : null;
        })()}
      </AnimatePresence>

      <Analytics />
    </>
  );
}
