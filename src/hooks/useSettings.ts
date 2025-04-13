import {SettingsContextType} from "../types.ts";
import {useContext} from "react";
import {SettingsContext} from "../providers/Context.tsx";

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}