import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {useSettings} from "../../../hooks/useSettings.ts";

const degToRad = (deg: number) => deg * Math.PI / 180;

const SimVehicleOutline = () => {
  const { scene } = useGLTF("/Car.glb");

  const { selectedRotation } = useSettings();

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m?.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        const mat = mesh.material;
        if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
          mat.transparent = true;
          mat.opacity = 0.4;
          mat.side = THREE.DoubleSide;
          // Keep depthWrite = true to avoid z-fighting artifacts
          mat.depthWrite = true;
          // mat.color = new THREE.Color(0x00ffff);
          mat.color = new THREE.Color('red');
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={[0, 0.1, 0]}
      rotation={[0, -Math.PI / 2 + degToRad(selectedRotation), 0]}
      scale={[0.14, 0.16, 0.16]}
    />
  );
};

export default SimVehicleOutline;
