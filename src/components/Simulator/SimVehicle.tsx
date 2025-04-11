import {useGLTF} from "@react-three/drei";

const SimVehicle = () => {
  const { scene } = useGLTF('/Car.glb');
  return <primitive object={scene}
                    position={[0, 0.5, 0.08]}
                    scale={[0.14, 0.16, 0.16]}
                    rotation={[0, -Math.PI / 2, 0]} />
};

export default SimVehicle;

