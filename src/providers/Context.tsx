import {createContext} from "react";
import {VehicleContextType, SettingsContextType, GridContextType, CodeContextType, UIContextType} from "../types.ts";

export const SettingsContext = createContext<SettingsContextType | null>(null);
export const GridContext = createContext<GridContextType | null>(null)
export const CodeContext = createContext<CodeContextType | null>(null)
export const VehicleContext = createContext<VehicleContextType | null>(null);
export const UIContext = createContext<UIContextType| null>(null)