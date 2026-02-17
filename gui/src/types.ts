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
    image: '/textures/trees.png',
  },
  [Barrier.FOUNTAIN]:{
    key: 'FOUNTAIN',
    image: '/textures/fountain.png',
  },
  [Barrier.LAKE]: {
    key: 'LAKE',
    image: '/textures/lake.png',
  },
  [Barrier.FILED]: {
    key: 'FILED',
    image: '/textures/field.png',
  },
}

export enum Sticker {
  ROAD_INTERSECT = 'Raskržije',
  ROAD_T = 'T raskržije',
  ROAD_STRAIGHT = 'Cesta',
  ROAD_TURN = 'Zavoj',
  HOUSE_GREEN = 'Zelena kuća',
  HOUSE_RED = 'Crvena kuća',
  HOUSE_RED_SANTA = 'Crvena kuća (Djed Mraz)',
  HOUSE_BLUE = 'Plava kuća',
  HOUSE_YELLOW = 'Žuta kuća',
  POST_OFFICE = 'Pošta',
  RESTAURANT = 'Restoran',
  WAREHOUSE = 'Skladište',
  ELF_WORKSHOP = 'Radionica patuljaka',
}

interface StickerData {
  key: string
  image: string,
  scale?: number,
}

export const Stickers: Record<Sticker, StickerData> = {
  [Sticker.ROAD_INTERSECT]: {
    key: 'ROAD_INTERSECT',
    image: '/textures/road_intersect.png',
    scale: 1,
  },
  [Sticker.ROAD_T]: {
    key: 'ROAD_T',
    image: '/textures/road_t.png',
    scale: 1,
  },
  [Sticker.ROAD_STRAIGHT]: {
    key: 'ROAD_STRAIGHT',
    image: '/textures/road_straight.png',
    scale: 1,
  },
  [Sticker.ROAD_TURN]: {
    key: 'ROAD_TURN',
    image: '/textures/road_turn.png',
    scale: 1,
  },
  [Sticker.HOUSE_GREEN]: {
    key: 'HOUSE_GREEN',
    image: '/textures/house_green.png',
  },
  [Sticker.HOUSE_RED]: {
    key: 'HOUSE_RED',
    image: '/textures/house_red.png',
  },
  [Sticker.HOUSE_RED_SANTA]: {
    key: 'HOUSE_RED_SANTA',
    image: '/textures/house_red_santa.png',
  },
  [Sticker.HOUSE_BLUE]: {
    key: 'HOUSE_BLUE',
    image: '/textures/house_blue.png',
  },
  [Sticker.HOUSE_YELLOW]: {
    key: 'HOUSE_YELLOW',
    image: '/textures/house_yellow.png',
  },
  [Sticker.POST_OFFICE]: {
    key: 'POST_OFFICE',
    image: '/textures/post_office.png',
  },
  [Sticker.RESTAURANT]: {
    key: 'RESTAURANT',
    image: '/textures/restoraunt.png',
  },
  [Sticker.WAREHOUSE]: {
    key: 'WAREHOUSE',
    image: '/textures/warehouse.png',
  },
  [Sticker.ELF_WORKSHOP]: {
    key: 'ELF_WORKSHOP',
    image: '/textures/elf_workshop.png',
  },
};