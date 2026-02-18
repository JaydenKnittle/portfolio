import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import FloatingIsland from './FloatingIsland';
import NebulaBackground from './NebulaBackground';
import Starfield from './Starfield';
import AtmosphericLighting from './AtmosphericLighting';

function AutoOrbitCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * 0.05;
    const radius = 18;
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = 4 + Math.sin(t * 0.4) * 2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 4, 18], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050a08']} />
          <fog attach="fog" args={['#050a08', 35, 90]} />
          <AtmosphericLighting />
          <Starfield />
          <NebulaBackground />
          <FloatingIsland position={[-6, -1, -2]} color="#10b981" id="deco-1" />
          <FloatingIsland position={[8, 1.5, -5]} color="#34d399" id="deco-2" />
          <FloatingIsland position={[-2, -2.5, -10]} color="#6ee7b7" id="deco-3" />
          <AutoOrbitCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
