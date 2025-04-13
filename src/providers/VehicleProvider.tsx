import {PropsWithChildren, useState} from "react";
import {MoveCommand, Position, Rotation} from "../types.ts";
import {VehicleContext} from "./Context.tsx";

export const VehicleProvider = ({ children }: PropsWithChildren) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0.5, z: 2 }); // ovo izvuces iz grid info, kao start pozicija
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: -Math.PI / 2, z: 0 });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveQueue, setMoveQueue] = useState<MoveCommand[]>([]);
  const [currentMove, setCurrentMove] = useState<MoveCommand | null>(null);

  const queueMoves = (moves: MoveCommand[]) => {
    setMoveQueue(moves);
    setIsMoving(true);
  };

  return (
    <VehicleContext.Provider value={{
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