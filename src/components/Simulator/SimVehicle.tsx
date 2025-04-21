import {useGLTF} from "@react-three/drei";
import {useEffect, useRef} from "react";
import {useVehicle} from "../../hooks/useVehicle.ts";
import {MoveCommand, Position, Rotation} from "../../types.ts";
import * as THREE from 'three';
import {Euler, Vector3} from "three";
import {useFrame} from "@react-three/fiber";
import {useSettings} from "../../hooks/useSettings.ts";
import {useGrid} from "../../hooks/useGrid.ts";

const SimVehicle = () => {
  const { sizeX, sizeZ, barriers } = useGrid();
  const { startPosition, position, rotation, isMoving, moveQueue, currentMove,
    setPosition, setRotation, setIsMoving, queueMoves, setCurrentMove } = useVehicle();
  const { animationSpeed } = useSettings();
  const vehicleRef = useRef<THREE.Object3D>(null);
  const currentMoveRef = useRef<MoveCommand | null>(null);

  const targetPos = useRef<Vector3>(new Vector3(position.x, position.y, position.z));
  const targetRot = useRef<Euler>(new Euler(rotation.x, rotation.y, rotation.z));
  // const gridSize = { x: 5, z: 6 };

  const isValidMove = (newPosition: Position) => {
    const x = Math.floor(sizeX / 2) - newPosition.x;
    const z = 2 - newPosition.z;
    const index = x * sizeZ + z;

    return !(x >= sizeX || x < 0 || z >= sizeZ || z < 0 || barriers.includes(index));
  }

  useFrame(() => {
    if(!vehicleRef.current || !isMoving) return;

    const positionCloseEnough = vehicleRef.current.position.distanceTo(targetPos.current) < 0.01;
    const targetQuat = new THREE.Quaternion().setFromEuler(targetRot.current);
    const rotationCloseEnough = vehicleRef.current.quaternion.angleTo(targetQuat) < 0.01;

    if (positionCloseEnough && rotationCloseEnough && moveQueue.length !== 0) {
      const nextMove = moveQueue[0];
      currentMoveRef.current = nextMove;
      const newMoveQueue = [...moveQueue.slice(1)];

      console.log(nextMove, currentMove);

      if (nextMove.type === 'move' && nextMove.direction) {
        const moveDirection = new Vector3(0, 0, 0);
        if (nextMove.direction === 'forward'){
          moveDirection.x = -1;
        } else if (nextMove.direction === 'backward'){
          moveDirection.x = 1;
        }

        moveDirection.applyEuler(vehicleRef.current.rotation);

        const newPos: Position = {
          x: position.x + Math.round(moveDirection.x),
          y: position.y,
          z: position.z + Math.round(moveDirection.z),
        }

        if (!isValidMove(newPos)) return;
        targetPos.current.set(newPos.x, newPos.y, newPos.z);
        setPosition(newPos);
      }
      else if (nextMove.type === 'rotate' && nextMove.direction) {
        const newRot: Rotation = {...rotation}
        if (nextMove.direction === 'left') {
          newRot.y += Math.PI / 2;
        } else if (nextMove.direction === 'right') {
          newRot.y -= Math.PI / 2;
        }

        targetRot.current.set(newRot.x, newRot.y, newRot.z);
        setRotation(newRot);
      }

      if(moveQueue.length === 0){
        setIsMoving(false);
        setCurrentMove(null);
      } else {
        queueMoves(newMoveQueue);
      }
    }

    if (currentMoveRef.current?.type === 'move') {
      vehicleRef.current.position.lerp(targetPos.current, animationSpeed);
    } else if (currentMoveRef.current?.type === 'rotate') {
      vehicleRef.current.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(targetRot.current),
        animationSpeed
      );
    }
  })

  const { scene } = useGLTF('/Car.glb');
  useEffect(() => {
    scene.traverse((child) => {
      if ('isMesh' in child && child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive ref={vehicleRef} object={scene}
                    position={[startPosition.x, startPosition.y, startPosition.z]}
                    rotation={[0, -Math.PI / 2, 0]}
                    scale={[.14, 0.16, 0.16]}/>
};

export default SimVehicle;

