import {PropsWithChildren, useState} from "react";
import {SettingsContext} from "./Context.tsx";
import {Sticker, Stickers, TileType} from "../types.ts";
import {Texture, TextureLoader} from "three";

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useState<string>(localStorage.getItem("selectedID") || '');
  const [selectedType, setSelectedType] = useState<TileType>(TileType.GROUND);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [simFocused, setSimFocused] = useState<boolean>(false);
  const [animationSpeed, setSpeed] = useState<number>(0.07);
  const [textures, setTextures] = useState<Record<Sticker, Texture>>({} as Record<Sticker, Texture>);

  const setAnimationSpeed = (speed: number) =>{
    // max 0.1, min 0.02, default 0.4
    setSpeed(speed / 1000);
  }

  const loadTextures = () => {
    const loader = new TextureLoader();
    const textureMap: Record<string, Texture> = {};
    const entries = Object.entries(Stickers);
    let loadedCount = 0;
    const total = entries.length;

    entries.forEach(([key, sticker]) => {
      loader.load(sticker.image, (texture) => {
        textureMap[key] = texture;
        loadedCount++;
        if (loadedCount === total) {
          setTextures(textureMap);
        }
      });
    });
  };

  return (
    <SettingsContext.Provider value={{
      selectedTab, setSelectedTab,
      selectedType, setSelectedType,
      selectedSticker, setSelectedSticker,
      simFocused, setSimFocused,
      animationSpeed, setAnimationSpeed,
      textures, loadTextures
    }}>
      {children}
    </SettingsContext.Provider>
  );
};