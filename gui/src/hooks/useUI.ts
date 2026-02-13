import {UIContextType} from "../types.ts";
import {useContext} from "react";
import {UIContext} from "../providers/Context.tsx";

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
};