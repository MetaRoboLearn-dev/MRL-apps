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
  }[]>([]);
  const [loaded, setLoaded] = useState(false);

  function getPlaceableKey(value: string): keyof typeof Placeable | undefined {
    return (Object.keys(Placeable) as (keyof typeof Placeable)[]).find(
      (key) => Placeable[key] === value
    );
  }

  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) return;

    const data = JSON.parse(raw);
    setSizeX(data.sizeX);
    setSizeZ(data.sizeZ);
    setBarriers(data.barriers || []);
    setStickers(
      (data.stickers || []).map(({ index, sticker }: { index: number; sticker: string }) => {
        const key = Placeable[sticker as keyof typeof Placeable]
          ?? getPlaceableKey(sticker);

        const stickerData = Stickers[key as Placeable];

        if (!stickerData) {
          console.warn(`Unknown sticker type: ${sticker}`);
          return null;
        }

        return { index, sticker: stickerData };
      }).filter(Boolean)
    );


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
        stickers: stickers.map(({ index, sticker }) => ({
          index,
          sticker: getPlaceableKey(sticker.type) || sticker.type,
        })),
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [start, finish, barriers, stickers, selectedTab, loaded]);

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