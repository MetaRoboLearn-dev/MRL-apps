import {createContext} from "react";
import {
  VehicleContextType,
  TaskConfigType,
  GridContextType,
  CodeContextType,
  UIContextType, ToastContextType,
} from "../types.ts";

export const TaskConfigContext = createContext<TaskConfigType | null>(null);
export const GridContext = createContext<GridContextType | null>(null)
export const CodeContext = createContext<CodeContextType | null>(null)
export const VehicleContext = createContext<VehicleContextType | null>(null);
export const UIContext = createContext<UIContextType| null>(null)
export const ToastContext = createContext<ToastContextType | null>(null)