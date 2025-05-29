import {PropsWithChildren, useState} from "react";
import {SettingsContext} from "./Context.tsx";
import {Placeable, TileType} from "../types.ts";

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useState<string>(localStorage.getItem("selectedID") || '');
  const [selectedType, setSelectedType] = useState<TileType>(TileType.GROUND);
  const [selectedPlaceable, setSelectedPlaceable] = useState<Placeable>(Placeable.HOUSE_RED);
  const [simFocused, setSimFocused] = useState<boolean>(false);
  const [animationSpeed, setSpeed] = useState<number>(0.07);

  const setAnimationSpeed = (speed: number) =>{
    // max 0.1, min 0.02, default 0.4
    setSpeed(speed / 1000);
  }

  return (
    <SettingsContext.Provider value={{
      selectedTab, setSelectedTab,
      selectedType, setSelectedType,
      selectedPlaceable, setSelectedPlaceable,
      simFocused, setSimFocused,
      animationSpeed, setAnimationSpeed,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};