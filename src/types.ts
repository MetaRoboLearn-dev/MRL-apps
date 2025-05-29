import {RefObject, ReactNode} from "react";
import * as THREE from 'three';
import {Texture} from "three";

// common use for 3d and movement
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



// grid stuff
export enum TileType {
  START = 'Početak',
  FINISH = 'Kraj',
  GROUND = 'Tlo',
  BARRIER = 'Prepreka',
  STICKER = 'Naljepnica'
}

export enum Placeable {
  HOUSE_GREEN = 'Zelena kuća',
  HOUSE_RED = 'Crvena kuća',
  HOUSE_BLUE = 'Plava kuća',
  HOUSE_YELLOW = 'Žuta kuća',
  POST_OFFICE = 'Pošta',
  RESTAURANT = 'Restoran',
  WAREHOUSE = 'Skladište',
}

export interface PlaceableSticker {
  type: Placeable,
  image: string,
  scale?: number,
}

export const Stickers: Record<Placeable, PlaceableSticker> = {
  [Placeable.HOUSE_GREEN]: {
    type: Placeable.HOUSE_GREEN,
    image: 'sticker/house_green.png',
    scale: 1,
  },
  [Placeable.HOUSE_RED]: {
    type: Placeable.HOUSE_RED,
    image: 'sticker/house_red.png',
    scale: 1,
  },
  [Placeable.HOUSE_BLUE]: {
    type: Placeable.HOUSE_BLUE,
    image: 'sticker/house_blue.png',
    scale: 1,
  },
  [Placeable.HOUSE_YELLOW]: {
    type: Placeable.HOUSE_YELLOW,
    image: 'sticker/house_yellow.png',
    scale: 1,
  },
  [Placeable.POST_OFFICE]: {
    type: Placeable.POST_OFFICE,
    image: 'sticker/post_office.png',
    scale: 1,
  },
  [Placeable.RESTAURANT]: {
    type: Placeable.RESTAURANT,
    image: 'sticker/restoraunt.png',
    scale: 1,
  },
  [Placeable.WAREHOUSE]: {
    type: Placeable.WAREHOUSE,
    image: 'sticker/warehouse.png',
    scale: 1,
  },
};



// context interfaces
export interface SettingsContextType {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedType: TileType;
  setSelectedType: (selectedType: TileType) => void;
  selectedPlaceable: Placeable;
  setSelectedPlaceable: (selectedPlaceable: Placeable) => void;
  simFocused: boolean;
  setSimFocused: (simFocused: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (animationSpeed: number) => void;
  textures: Record<Placeable, Texture>;
  loadTextures: () => void;
}

export interface VehicleContextType {
  vehicleRef: RefObject<THREE.Object3D | null>;
  reset: () => void;
  startPosition: Position;
  startRotation: Rotation;
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
  stickers: {
    index: number
    sticker: PlaceableSticker
  }[];
  setStickers: (stickers: {
    index: number
    sticker: PlaceableSticker
  }[]) => void;
}

export interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}

export interface UIContextType {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  modalHeader: ReactNode;
  setModalHeader: (header: ReactNode) => void;
  modalBody: ReactNode;
  setModalBody: (body: ReactNode) => void;
  modalFooter: ReactNode;
  setModalFooter: (footer: ReactNode) => void;
}