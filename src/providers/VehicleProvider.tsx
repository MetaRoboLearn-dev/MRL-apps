import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {MoveCommand, Position, Rotation} from "../types.ts";
import {VehicleContext} from "./Context.tsx";
import {useGrid} from "../hooks/useGrid.ts";
import * as THREE from "three";

export const VehicleProvider = ({ children }: PropsWithChildren) => {
  const { start, sizeX, sizeZ } = useGrid();

  const startPosition = start !== null ? { x: -Math.floor(start / sizeX) + 2, y: 0.5, z: -(start % sizeZ) + 2 } : {x: 0, y: -2, z: 0};
  const startRotation = { x: 0, y: -Math.PI / 2, z: 0 };

  const [position, setPosition] = useState<Position>(startPosition);
  const [rotation, setRotation] = useState<Rotation>(startRotation);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveQueue, setMoveQueue] = useState<MoveCommand[]>([]);
  const [currentMove, setCurrentMove] = useState<MoveCommand | null>(null);

  const vehicleRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    setPosition(start !== null ? { x: -Math.floor(start / sizeX) + 2, y: 0.5, z: -(start % sizeZ) + 2 } : {x: 0, y: -2, z: 0});

    // ovo mijenjanje rotacije ne radi na vehicle refu
    setRotation({ x: 0, y: -Math.PI / 2, z: 0 })
  }, [sizeX, sizeZ, start])

  const queueMoves = (moves: MoveCommand[]) => {
    if (!start) return;
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