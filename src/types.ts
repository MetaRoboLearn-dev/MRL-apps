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
  HOLE = 'Rupa',
}

interface BarrierData {
  key: string;
  model?: string;
}

export const Barriers: Record<Barrier, BarrierData> = {
  [Barrier.TREES]: {
    key: 'TREES',
  },
  [Barrier.FOUNTAIN]:{
    key: 'FOUNTAIN',
  },
  [Barrier.LAKE]: {
    key: 'LAKE',
  },
  [Barrier.HOLE]: {
    key: 'HOLE',
  },
}

export enum Sticker {
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
  [Sticker.HOUSE_GREEN]: {
    key: 'HOUSE_GREEN',
    image: 'sticker/house_green.png',
  },
  [Sticker.HOUSE_RED]: {
    key: 'HOUSE_RED',
    image: 'sticker/house_red.png',
  },
  [Sticker.HOUSE_BLUE]: {
    key: 'HOUSE_BLUE',
    image: 'sticker/house_blue.png',
  },
  [Sticker.HOUSE_YELLOW]: {
    key: 'HOUSE_YELLOW',
    image: 'sticker/house_yellow.png',
  },
  [Sticker.POST_OFFICE]: {
    key: 'POST_OFFICE',
    image: 'sticker/post_office.png',
  },
  [Sticker.RESTAURANT]: {
    key: 'RESTAURANT',
    image: 'sticker/restoraunt.png',
  },
  [Sticker.WAREHOUSE]: {
    key: 'WAREHOUSE',
    image: 'sticker/warehouse.png',
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
  simFocused: boolean;
  setSimFocused: (simFocused: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (animationSpeed: number) => void;
  textures: Record<Sticker, Texture>;
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
  barriers: Map<number, Barrier>;
  setBarriers: (barriers: Map<number, Barrier>) => void;
  stickers: { index: number, sticker: Sticker }[];
  setStickers: (stickers: { index: number, sticker: Sticker }[]) => void;
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