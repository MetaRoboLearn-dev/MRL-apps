import {DoubleSide, TextureLoader} from "three";

const SimFountain = () => {
  const loader = new TextureLoader();
  const texture = loader.load('textures/fountain.png');

  return (
    <group>
      <mesh position={[0, 0.525, 0]} scale={[0.8, 0.05, 0.8]} receiveShadow={true}>
        <boxGeometry/>
        <meshStandardMaterial color={'green'}/>
      </mesh>
      <mesh position={[0, 0.555, 0]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.7, 0.7, 0]}>
        <planeGeometry args={[1, 1]}/>
        <meshBasicMaterial map={texture} transparent={true} side={DoubleSide}/>
      </mesh>
    </group>
  );
};

export default SimFountain;