import { Stars } from '@react-three/drei';

export default function Starfield() {
  return <Stars radius={120} depth={60} count={4000} factor={4} saturation={0} fade speed={0.8} />;
}
