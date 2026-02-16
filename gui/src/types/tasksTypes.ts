import {UserBasic} from "./userTypes.ts";

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