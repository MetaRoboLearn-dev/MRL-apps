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

export enum Barrier {
  TREES = 'Drveće',
  FOUNTAIN = 'Fontana',
  LAKE = 'Jezero',
  FILED = 'Polje',
}

interface BarrierData {
  key: string;
  image: string;
  model?: string;
}

export const Barriers: Record<Barrier, BarrierData> = {
  [Barrier.TREES]: {
    key: 'TREES',
    image: 'textures/trees.png',
  },
  [Barrier.FOUNTAIN]:{
    key: 'FOUNTAIN',
    image: 'textures/fountain.png',
  },
  [Barrier.LAKE]: {
    key: 'LAKE',
    image: 'textures/lake.png',
  },
  [Barrier.FILED]: {
    key: 'FILED',
    image: 'textures/field.png',
  },
}

export enum Sticker {
  ROAD_INTERSECT = 'Raskržije',
  ROAD_T = 'T raskržije',
  ROAD_STRAIGHT = 'Cesta',
  ROAD_TURN = 'Zavoj',
  HOUSE_GREEN = 'Zelena kuća',
  HOUSE_RED = 'Crvena kuća',
  HOUSE_BLUE = 'Plava kuća',
  HOUSE_YELLOW = 'Žuta kuća',
  POST_OFFICE = 'Pošta',
  RESTAURANT = 'Restoran',
  WAREHOUSE = 'Skladište',
}

interface StickerData {
  key: string
  image: string,
  scale?: number,
}

export const Stickers: Record<Sticker, StickerData> = {
  [Sticker.ROAD_INTERSECT]: {
    key: 'ROAD_INTERSECT',
    image: 'textures/road_intersect.png',
    scale: 1,
  },
  [Sticker.ROAD_T]: {
    key: 'ROAD_T',
    image: 'textures/road_t.png',
    scale: 1,
  },
  [Sticker.ROAD_STRAIGHT]: {
    key: 'ROAD_STRAIGHT',
    image: 'textures/road_straight.png',
    scale: 1,
  },
  [Sticker.ROAD_TURN]: {
    key: 'ROAD_TURN',
    image: 'textures/road_turn.png',
    scale: 1,
  },
  [Sticker.HOUSE_GREEN]: {
    key: 'HOUSE_GREEN',
    image: 'textures/house_green.png',
  },
  [Sticker.HOUSE_RED]: {
    key: 'HOUSE_RED',
    image: 'textures/house_red.png',
  },
  [Sticker.HOUSE_BLUE]: {
    key: 'HOUSE_BLUE',
    image: 'textures/house_blue.png',
  },
  [Sticker.HOUSE_YELLOW]: {
    key: 'HOUSE_YELLOW',
    image: 'textures/house_yellow.png',
  },
  [Sticker.POST_OFFICE]: {
    key: 'POST_OFFICE',
    image: 'textures/post_office.png',
  },
  [Sticker.RESTAURANT]: {
    key: 'RESTAURANT',
    image: 'textures/restoraunt.png',
  },
  [Sticker.WAREHOUSE]: {
    key: 'WAREHOUSE',
    image: 'textures/warehouse.png',
  },
};



// context interfaces
export interface SettingsContextType {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedType: TileType;
  setSelectedType: (selectedType: TileType) => void;
  selectedSticker: Sticker | null;
  setSelectedSticker: (selectedPlaceable: Sticker | null) => void;
  selectedBarrier: Barrier;
  setSelectedBarrier: (selectedBarrier: Barrier) => void;
  selectedRotation: number;
  rotateBy90: () => void;
  simFocused: boolean;
  setSimFocused: (simFocused: boolean) => void;
  camMode: boolean;
  setCamMode: (camMode: boolean) => void;
  barriers3D: boolean;
  setBarriers3D: (barriers3D: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (animationSpeed: number) => void;
  textures: Record<Sticker, Texture>;
  loadTextures: () => void;
  barrierTextures: Record<Barrier, Texture>;
  loadBarrierTextures: () => void;
  robotUrl: string | null;
  setRobotUrl: (robotUrl: string | null) => void;
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
  startRotationOffset: number;
  setStartRotationOffset: (startRotation: number) => void;
  finish: number | null;
  setFinish: (finish: number | null) => void;
  barriers: Map<number, Barrier>;
  setBarriers: (barriers: Map<number, Barrier>) => void;
  stickers: { index: number, sticker: Sticker, rotation: number }[];
  setStickers: (stickers: { index: number, sticker: Sticker, rotation: number }[]) => void;
}

export interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  codeRef: RefObject<string>;
  blocks: string;
  setBlocks: (code: string) => void;
  blocksRef: RefObject<string>;
  modeRef: RefObject<string>;
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