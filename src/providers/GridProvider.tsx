import {PropsWithChildren, useEffect, useState} from "react";
import {GridContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";
import {Placeable, PlaceableSticker, Stickers} from "../types.ts";

const GridProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
  const [sizeX, setSizeX] = useState<number>(0);
  const [sizeZ, setSizeZ] = useState<number>(0);
  const [start, setStart] = useState<number | null>(null);
  const [finish, setFinish] = useState<number | null>(null);
  const [barriers, setBarriers] = useState<number[]>([]);
  const [stickers, setStickers] = useState<{
    index: number;
    sticker: PlaceableSticker
  }[]>([{index: 0, sticker: Stickers[Placeable.RESTORAUNT]}]);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) return;

    const data = JSON.parse(raw);
    setSizeX(data.sizeX);
    setSizeZ(data.sizeZ);
    setBarriers(data.barriers || []);

    const computedStart = data.sizeZ * (Math.trunc(data.sizeX / 2) + data.sizeX % 2 - 1);
    const computedFinish = data.sizeZ * (Math.trunc(data.sizeX / 2) + 1) - 1;

    setStart(data.start !== null ? data.start : computedStart);
    setFinish(data.finish !== null ? data.finish : computedFinish);
    setLoaded(true);
  }, [selectedTab]);

  useEffect(() => {
    if (!selectedTab || !loaded) return;

    try {
      const current = localStorage.getItem(selectedTab);
      const parsed = current ? JSON.parse(current) : {};

      const updated = {
        ...parsed,
        start,
        finish,
        barriers,
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [start, finish, barriers, selectedTab, loaded]);

  return (
    <GridContext.Provider value={{
      sizeX, setSizeX,
      sizeZ, setSizeZ,
      start, setStart,
      finish, setFinish,
      barriers, setBarriers,
      stickers, setStickers
    }}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;