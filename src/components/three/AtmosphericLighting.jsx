export default function AtmosphericLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 12, -5]} color="#34d399" intensity={18} distance={70} decay={2} />
      <pointLight position={[-18, 8, -12]} color="#10b981" intensity={15} distance={60} decay={2} />
      <pointLight position={[0, -8, -20]} color="#6ee7b7" intensity={12} distance={60} decay={2} />
      <directionalLight position={[5, 10, 5]} color="#6ee7b7" intensity={0.8} />
    </>
  );
}
