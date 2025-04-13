// u kontekst
// gridSize, simFocused, tank holder index, grid edit postavke

import {createContext, Dispatch, SetStateAction} from "react";
import {VehicleContextType, SettingsContextType} from "../types.ts";

// upitno (jer je ovisno o posebnom simu)
export const HolderIndexContext
  = createContext<[number, Dispatch<SetStateAction<number>>]> ([-1, () => {}]);

// sigurno ok
export const ActiveCodeContext
  = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => {}]);

export const SettingsContext = createContext<SettingsContextType | null>(null);
export const VehicleContext = createContext<VehicleContextType | null>(null);
