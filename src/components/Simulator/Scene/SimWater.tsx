import { DoubleSide } from "three";

const SimWater = () => {
  return (
    <mesh position={[-10, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[50, 50, 1]}>
      <planeGeometry/>
      <meshBasicMaterial color="#00beee" side={DoubleSide}/>
    </mesh>
  );
};

export default SimWater;