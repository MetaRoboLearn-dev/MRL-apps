import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {MoveCommand, Position, Rotation} from "../types.ts";
import {VehicleContext} from "./Context.tsx";
import {useGrid} from "../hooks/useGrid.ts";
import * as THREE from "three";

export const VehicleProvider = ({ children }: PropsWithChildren) => {
  const { start, sizeX, sizeZ } = useGrid();

  const calcStartPosition = (start: number | null, sizeX: number, sizeZ: number): Position => {
    if (start === null) {
      return { x: 0, y: -2, z: 0 };
    }
    return {
      x: -Math.trunc(start / sizeZ) + Math.trunc(sizeX / 2),
      y: 0.1,
      z: -(start % sizeZ) + 2,
    };
  };

  const startPosition = calcStartPosition(start, sizeX, sizeZ)
  const startRotation = { x: 0, y: -Math.PI / 2, z: 0 };

  const [position, setPosition] = useState<Position>(startPosition);
  const [rotation, setRotation] = useState<Rotation>(startRotation);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveQueue, setMoveQueue] = useState<MoveCommand[]>([]);
  const [currentMove, setCurrentMove] = useState<MoveCommand | null>(null);

  const vehicleRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    setPosition(calcStartPosition(start, sizeX, sizeZ));
  }, [sizeX, sizeZ, start])

  const queueMoves = (moves: MoveCommand[]) => {
    if (start === null) return;
    setMoveQueue(moves);
    setIsMoving(true);
  };

  const reset = () => {
    setIsMoving(false);
    setMoveQueue([]);
    setPosition(startPosition);
    setRotation(startRotation);
    vehicleRef.current?.position.set(startPosition.x, startPosition.y, startPosition.z);
    vehicleRef.current?.rotation.set(startRotation.x, startRotation.y, startRotation.z);
  }

  return (
    <VehicleContext.Provider value={{
      vehicleRef, reset,
      startPosition, startRotation,
      position, setPosition,
      rotation, setRotation,
      isMoving, setIsMoving,
      moveQueue, queueMoves,
      currentMove, setCurrentMove
    }}>
      {children}
    </VehicleContext.Provider>
  );
};