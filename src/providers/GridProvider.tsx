import {PropsWithChildren, useEffect, useState} from "react";
import {GridContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";
import {Sticker, Stickers} from "../types.ts";

const GridProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
  const [sizeX, setSizeX] = useState<number>(0);
  const [sizeZ, setSizeZ] = useState<number>(0);

  const [start, setStart] = useState<number | null>(null);
  const [finish, setFinish] = useState<number | null>(null);

  const [barriers, setBarriers] = useState<number[]>([]);
  const [stickers, setStickers] = useState<{ index: number, sticker: Sticker }[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) return;

    const data = JSON.parse(raw);
    setSizeX(data.sizeX);
    setSizeZ(data.sizeZ);
    setBarriers(data.barriers || []);
    setStickers(
      (data.stickers || []).map(({ index, sticker }: { index: number; sticker: string }) => {
        const key = Sticker[sticker as keyof typeof Sticker];
        const stickerData = Stickers[key];

        if (!stickerData) {
          console.warn(`Unknown sticker type: ${sticker}`);
          return null;
        }

        return { index, sticker: key };
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

    const current = localStorage.getItem(selectedTab);
    const parsed = current ? JSON.parse(current) : {};

    const updated = {
      ...parsed,
      start,
      finish,
      barriers,
      stickers: stickers.map(({ index, sticker }) => ({
        index,
        sticker: Stickers[sticker].key,
      })),
    };

    localStorage.setItem(selectedTab, JSON.stringify(updated));
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