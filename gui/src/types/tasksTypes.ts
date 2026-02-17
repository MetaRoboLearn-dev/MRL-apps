import {UserBasic} from "./userTypes.ts";
import {Barrier, Sticker} from "../types.ts";

export type TaskPreview = {
  id: number;
  title: string;
  description: string | null;
  size_x: number;
  size_z: number;
  created_at: string;
  created_by: number;
  active: boolean;
  creator: UserBasic;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  size_x: number;
  size_z: number;
  start: number | null;
  rotation: number;
  finish: number | null;
  barriers: [number, keyof typeof Barrier][] | null;
  stickers: { index: number; sticker: keyof typeof Sticker; rotation: number }[] | null;
  code: string | null;
  blocks: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  active: boolean;
}