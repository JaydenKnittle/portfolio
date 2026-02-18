import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function NebulaBackground() {
  const g1 = useRef();
  const g2 = useRef();
  const g3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.02;
    if (g1.current) g1.current.rotation.y = t;
    if (g2.current) g2.current.rotation.y = -t * 0.7;
    if (g3.current) g3.current.rotation.x = t * 0.5;
  });

  return (
    <group>
      <mesh ref={g1} position={[30, 15, -50]} scale={20}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#1a0533" transparent opacity={0.25} />
      </mesh>
      <mesh ref={g2} position={[-40, -10, -60]} scale={25}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#0c1445" transparent opacity={0.2} />
      </mesh>
      <mesh ref={g3} position={[0, -20, -40]} scale={18}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#1a1030" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
