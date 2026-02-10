import {PropsWithChildren, useEffect, useState} from "react";
import {GridContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";
import {Barrier, Barriers, Sticker, Stickers} from "../types.ts";

const GridProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
  const [sizeX, setSizeX] = useState<number>(0);
  const [sizeZ, setSizeZ] = useState<number>(0);

  const [start, setStart] = useState<number | null>(null);
  const [startRotationOffset, setStartRotationOffset] = useState<number>(0);
  const [finish, setFinish] = useState<number | null>(null);

  // const [barriers, setBarriers] = useState<number[]>([]);
  const [barriers, setBarriers] = useState<Map<number, Barrier>>(new Map());
  const [stickers, setStickers] = useState<{ index: number, sticker: Sticker, rotation: number }[]>([]);

  const [loaded, setLoaded] = useState(false);

  // ucitavanje iz local storage
  // TODO - same as CodeProvider, most likely has a lot of redundancy. Check it out and optimize if possible
  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) {
      setSizeX(0);
      setSizeZ(0);
      return
    }

    const data = JSON.parse(raw);
    setSizeX(data.sizeX);
    setSizeZ(data.sizeZ);
    setStartRotationOffset(data.startRotationOffset);
    setBarriers(
      new Map(
        (data.barriers || []).map(
          ([index, key]: [number, keyof typeof Barrier]) => [index, Barrier[key]]
        )
      )
    );

    setStickers(
      (data.stickers || []).map(({ index, sticker, rotation }: { index: number; sticker: string; rotation: number }) => {
        const key = Sticker[sticker as keyof typeof Sticker];
        const stickerData = Stickers[key];

        if (!stickerData) {
          console.warn(`Unknown sticker type: ${sticker}`);
          return null;
        }

        return { index, sticker: key, rotation };
      }).filter(Boolean)
    );

    const computedStart = data.sizeZ * (Math.trunc(data.sizeX / 2) + data.sizeX % 2 - 1);
    const computedFinish = data.sizeZ * (Math.trunc(data.sizeX / 2) + 1) - 1;

    setStart(data.start !== null ? data.start : computedStart);
    setFinish(data.finish !== null ? data.finish : computedFinish);
    setLoaded(true);
  }, [selectedTab]);

  // spremanje u local storage
  useEffect(() => {
    if (!selectedTab || !loaded) return;

    const current = localStorage.getItem(selectedTab);
    const parsed = current ? JSON.parse(current) : {};

    const updated = {
      ...parsed,
      start,
      startRotationOffset,
      finish,
      barriers: [...barriers.entries()].map(([index, barrier]) => [
       index, Barriers[barrier].key
      ]),
      stickers: stickers.map(({ index, sticker, rotation }) => ({
        index,
        sticker: Stickers[sticker].key,
        rotation
      })),
    };

    localStorage.setItem(selectedTab, JSON.stringify(updated));
  }, [start, finish, barriers, stickers, selectedTab, loaded, startRotationOffset]);

  return (
    <GridContext.Provider value={{
      sizeX, setSizeX,
      sizeZ, setSizeZ,
      start, setStart,
      startRotationOffset, setStartRotationOffset,
      finish, setFinish,
      barriers, setBarriers,
      stickers, setStickers
    }}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;