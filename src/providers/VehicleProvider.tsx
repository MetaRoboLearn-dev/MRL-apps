import {PropsWithChildren, useState} from "react";
import {MoveCommand, Position, Rotation} from "../types.ts";
import {VehicleContext} from "./Context.tsx";
import {useGrid} from "../hooks/useGrid.ts";

export const VehicleProvider = ({ children }: PropsWithChildren) => {
  const { start, sizeX, sizeZ } = useGrid();

  const startPosition = start !== null ? { x: -Math.floor(start / sizeX) + 2, y: 0.5, z: -(start % sizeZ) + 2 } : {x: 0, y: -2, z: 0};
  const [position, setPosition] = useState<Position>(startPosition);
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: -Math.PI / 2, z: 0 });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveQueue, setMoveQueue] = useState<MoveCommand[]>([]);
  const [currentMove, setCurrentMove] = useState<MoveCommand | null>(null);

  const queueMoves = (moves: MoveCommand[]) => {
    setMoveQueue(moves);
    setIsMoving(true);
  };

  const reset = () => {

  }

  return (
    <VehicleContext.Provider value={{
      startPosition,
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