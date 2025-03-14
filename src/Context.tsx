// u kontekst
// gridSize, simFocused, tank holder index, grid edit postavke

import {createContext, Dispatch, SetStateAction} from "react";

export const GridSizeContext = createContext<[number , Dispatch<SetStateAction<number>>]> ([10, () => {}]);
export const SimFocusedContext = createContext<[boolean , Dispatch<SetStateAction<boolean>>]> ([false, () => {}]);
export const HolderIndexContext = createContext<[number , Dispatch<SetStateAction<number>>] | null> ([-1, () => {}]);
export const EditSettingsContext = createContext<[boolean , Dispatch<SetStateAction<boolean>>] | null> ([false, () => {}]);