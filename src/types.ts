export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface MoveCommand {
  type: 'move' | 'rotate' | 'invalid';
  direction?: 'forward' | 'backward' | 'left' | 'right';
  command?: string;
}

export enum TileType {
  START = 'Početak',
  FINISH = 'Kraj',
  GROUND = 'Pod',
  BARRIER = 'Prepreka',
}

export interface SettingsContextType {
  simFocused: boolean;
  setSimFocused: (simFocused: boolean) => void;
  selectedType: TileType;
  setSelectedType: (selectedType: TileType) => void;
  animationSpeed: number;
  setAnimationSpeed: (animationSpeed: number) => void;
}

export interface VehicleContextType {
  position: Position;
  setPosition: (positions: Position) => void;
  rotation: Rotation;
  setRotation: (rotation: Rotation) => void;
  isMoving: boolean;
  setIsMoving: (isMoving: boolean) => void;
  moveQueue: MoveCommand[];
  queueMoves: (moves: MoveCommand[]) => void;
  currentMove: MoveCommand | null;
  setCurrentMove: (currentMove: MoveCommand | null) => void;
}

export interface GridContextType {
  sizeX: number;
  setSizeX: (sizeX: number) => void;
  sizeZ: number;
  setSizeZ: (sizeZ: number) => void;
  start: number | null;
  setStart: (start: number | null) => void;
  finish: number | null;
  setFinish: (finish: number | null) => void;
  barriers: number[];
  setBarriers: (barriers: number[]) => void;
}

export interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}