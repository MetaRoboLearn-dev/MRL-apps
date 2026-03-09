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
  type: 'move' | 'rotate' | 'display' | 'detect' | 'print';
  direction?: 'forward' | 'backward' | 'left' | 'right';
  blocked?: boolean;
  value?: string;
  result?: string;
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
  BEAR = 'bear',
  BENCH = 'bench',
  BIRD = 'bird',
  C_BLUE_YELLOW = 'c blue yellow',
  C_GREEN_BLUE = 'c green blue',
  C_GREEN_YELLOW = 'c green yellow',
  CAT = 'cat',
  CELLPHONE = 'cellphone',
  COW = 'cow',
  DOG = 'dog',
  DONUT = 'donut',
  ELEPHANT = 'elephant',
  FARMA = 'farma',
  FENCE_GREEN = 'fence green',
  GIRAFFE = 'giraffe',
  HORSE = 'horse',
  L_BLUE = 'l blue',
  L_GREEN = 'l green',
  L_YELLOW = 'l yellow',
  LJUBIMCI = 'ljubimci',
  PERSON = 'person',
  RESTAURANT_ZOO = 'restaurant',
  S_BLUE_BROWN = 's blue brown',
  S_BLUE_YELLOW = 's blue yellow',
  S_BLUE = 's blue',
  S_BROWN_YELLOW = 's brown yellow',
  S_GREEN_BLUE = 's green blue',
  S_GREEN_BROWN = 's green brown',
  S_GREEN_YELLOW = 's green yellow',
  S_GREEN = 's green',
  S_YELLOW = 's yellow',
  SAFARI = 'safari',
  SHEEP = 'sheep',
  SUMSKE_ZIVOTINJE = 'sumske zivotinje',
  T_BLUE_BROWN_GREEN = 't blue brown green',
  T_GREEN_BROWN_GREEN = 't green brown green',
  T_GREEN_BROWN_YELLOW = 't green brown yellow',
  T_GREEN = 't green',
  T_YELLOW_BROWN_BLUE = 't yellow brown blue',
  ZEBRA = 'zebra',
}

interface StickerData {
  key: string
  image: string,
  scale?: number,
}

export const Stickers: Record<Sticker, StickerData> = {
  [Sticker.ROAD_INTERSECT]: { key: 'ROAD_INTERSECT', image: '/textures/road_intersect.png', scale: 1 },
  [Sticker.ROAD_T]: { key: 'ROAD_T', image: '/textures/road_t.png', scale: 1 },
  [Sticker.ROAD_STRAIGHT]: { key: 'ROAD_STRAIGHT', image: '/textures/road_straight.png', scale: 1 },
  [Sticker.ROAD_TURN]: { key: 'ROAD_TURN', image: '/textures/road_turn.png', scale: 1 },
  [Sticker.HOUSE_GREEN]: { key: 'HOUSE_GREEN', image: '/textures/house_green.png' },
  [Sticker.HOUSE_RED]: { key: 'HOUSE_RED', image: '/textures/house_red.png' },
  [Sticker.HOUSE_RED_SANTA]: { key: 'HOUSE_RED_SANTA', image: '/textures/house_red_santa.png' },
  [Sticker.HOUSE_BLUE]: { key: 'HOUSE_BLUE', image: '/textures/house_blue.png' },
  [Sticker.HOUSE_YELLOW]: { key: 'HOUSE_YELLOW', image: '/textures/house_yellow.png' },
  [Sticker.POST_OFFICE]: { key: 'POST_OFFICE', image: '/textures/post_office.png' },
  [Sticker.RESTAURANT]: { key: 'RESTAURANT', image: '/textures/restoraunt.png' },
  [Sticker.WAREHOUSE]: { key: 'WAREHOUSE', image: '/textures/warehouse.png' },
  [Sticker.ELF_WORKSHOP]: { key: 'ELF_WORKSHOP', image: '/textures/elf_workshop.png' },
  [Sticker.BEAR]: { key: 'BEAR', image: '/textures/bear.png', scale: 1 },
  [Sticker.BENCH]: { key: 'BENCH', image: '/textures/bench.png', scale: 1 },
  [Sticker.BIRD]: { key: 'BIRD', image: '/textures/bird.png', scale: 1 },
  [Sticker.C_BLUE_YELLOW]: { key: 'C_BLUE_YELLOW', image: '/textures/c blue yellow.png', scale: 1 },
  [Sticker.C_GREEN_BLUE]: { key: 'C_GREEN_BLUE', image: '/textures/c green blue.png', scale: 1 },
  [Sticker.C_GREEN_YELLOW]: { key: 'C_GREEN_YELLOW', image: '/textures/c green yellow.png', scale: 1 },
  [Sticker.CAT]: { key: 'CAT', image: '/textures/cat.png', scale: 1 },
  [Sticker.CELLPHONE]: { key: 'CELLPHONE', image: '/textures/cellphone.png', scale: 1 },
  [Sticker.COW]: { key: 'COW', image: '/textures/cow.png', scale: 1 },
  [Sticker.DOG]: { key: 'DOG', image: '/textures/dog.png', scale: 1 },
  [Sticker.DONUT]: { key: 'DONUT', image: '/textures/donut.png', scale: 1 },
  [Sticker.ELEPHANT]: { key: 'ELEPHANT', image: '/textures/elephant.png', scale: 1 },
  [Sticker.FARMA]: { key: 'FARMA', image: '/textures/farma.png', scale: 1 },
  [Sticker.FENCE_GREEN]: { key: 'FENCE_GREEN', image: '/textures/fence green.png', scale: 1 },
  [Sticker.GIRAFFE]: { key: 'GIRAFFE', image: '/textures/giraffe.png', scale: 1 },
  [Sticker.HORSE]: { key: 'HORSE', image: '/textures/horse.png', scale: 1 },
  [Sticker.L_BLUE]: { key: 'L_BLUE', image: '/textures/l blue.png', scale: 1 },
  [Sticker.L_GREEN]: { key: 'L_GREEN', image: '/textures/l green.png', scale: 1 },
  [Sticker.L_YELLOW]: { key: 'L_YELLOW', image: '/textures/l yellow.png', scale: 1 },
  [Sticker.LJUBIMCI]: { key: 'LJUBIMCI', image: '/textures/ljubimci.png', scale: 1 },
  [Sticker.PERSON]: { key: 'PERSON', image: '/textures/person.png', scale: 1 },
  [Sticker.RESTAURANT_ZOO]: { key: 'RESTAURANT_ZOO', image: '/textures/restaurant.png', scale: 1 },
  [Sticker.S_BLUE_BROWN]: { key: 'S_BLUE_BROWN', image: '/textures/s blue brown.png', scale: 1 },
  [Sticker.S_BLUE_YELLOW]: { key: 'S_BLUE_YELLOW', image: '/textures/s blue yellow.png', scale: 1 },
  [Sticker.S_BLUE]: { key: 'S_BLUE', image: '/textures/s blue.png', scale: 1 },
  [Sticker.S_BROWN_YELLOW]: { key: 'S_BROWN_YELLOW', image: '/textures/s brown yellow.png', scale: 1 },
  [Sticker.S_GREEN_BLUE]: { key: 'S_GREEN_BLUE', image: '/textures/s green blue.png', scale: 1 },
  [Sticker.S_GREEN_BROWN]: { key: 'S_GREEN_BROWN', image: '/textures/s green brown.png', scale: 1 },
  [Sticker.S_GREEN_YELLOW]: { key: 'S_GREEN_YELLOW', image: '/textures/s green yellow.png', scale: 1 },
  [Sticker.S_GREEN]: { key: 'S_GREEN', image: '/textures/s green.png', scale: 1 },
  [Sticker.S_YELLOW]: { key: 'S_YELLOW', image: '/textures/s yellow.png', scale: 1 },
  [Sticker.SAFARI]: { key: 'SAFARI', image: '/textures/safari.png', scale: 1 },
  [Sticker.SHEEP]: { key: 'SHEEP', image: '/textures/sheep.png', scale: 1 },
  [Sticker.SUMSKE_ZIVOTINJE]: { key: 'SUMSKE_ZIVOTINJE', image: '/textures/sumske zivotinje.png', scale: 1 },
  [Sticker.T_BLUE_BROWN_GREEN]: { key: 'T_BLUE_BROWN_GREEN', image: '/textures/t blue brown green.png', scale: 1 },
  [Sticker.T_GREEN_BROWN_GREEN]: { key: 'T_GREEN_BROWN_GREEN', image: '/textures/t green brown green.png', scale: 1 },
  [Sticker.T_GREEN_BROWN_YELLOW]: { key: 'T_GREEN_BROWN_YELLOW', image: '/textures/t green brown yellow.png', scale: 1 },
  [Sticker.T_GREEN]: { key: 'T_GREEN', image: '/textures/t green.png', scale: 1 },
  [Sticker.T_YELLOW_BROWN_BLUE]: { key: 'T_YELLOW_BROWN_BLUE', image: '/textures/t yellow brown blue.png', scale: 1 },
  [Sticker.ZEBRA]: { key: 'ZEBRA', image: '/textures/zebra.png', scale: 1 },
};