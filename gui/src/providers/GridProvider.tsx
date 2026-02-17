import {PropsWithChildren, useState} from "react";
import {GridContext} from "./Context.tsx";
import {Barrier, Sticker} from "../types.ts";
import {Task} from "../types/tasksTypes.ts";

interface Props {
  task: Task
}

const GridProvider = ({ task: t, children }: PropsWithChildren<Props>) => {
  const [sizeX, setSizeX] = useState<number>(t.size_x);
  const [sizeZ, setSizeZ] = useState<number>(t.size_z);

  const [start, setStart] = useState<number | null>(t.start);
  const [startRotationOffset, setStartRotationOffset] = useState<number>(t.rotation);
  const [finish, setFinish] = useState<number | null>(t.finish);

  const [barriers, setBarriers] = useState<Map<number, Barrier>>(
    new Map(
        (t.barriers || []).map(
          ([index, key]: [number, keyof typeof Barrier]) => [index, Barrier[key]]
        )
      ));
  const [stickers, setStickers] = useState<{ index: number, sticker: Sticker, rotation: number }[]>(
    (t.stickers || []).map(({ index, sticker, rotation }) => ({
      index,
      sticker: Sticker[sticker as keyof typeof Sticker],
      rotation,
    }))
  );

  // const [loaded, setLoaded] = useState(false);

  // ucitavanje iz local storage
  // TODO - same as CodeProvider, most likely has a lot of redundancy. Check it out and optimize if possible
  // useEffect(() => {
  //   const raw = localStorage.getItem(selectedTab || '');
  //   if (!raw) {
  //     setSizeX(0);
  //     setSizeZ(0);
  //     return
  //   }
  //
  //   const data = JSON.parse(raw);
  //   setSizeX(data.sizeX);
  //   setSizeZ(data.sizeZ);
  //   setStartRotationOffset(data.startRotationOffset);
  //   setBarriers(
  //     new Map(
  //       (data.barriers || []).map(
  //         ([index, key]: [number, keyof typeof Barrier]) => [index, Barrier[key]]
  //       )
  //     )
  //   );
  //
  //   setStickers(
  //     (data.stickers || []).map(({ index, sticker, rotation }: { index: number; sticker: string; rotation: number }) => {
  //       const key = Sticker[sticker as keyof typeof Sticker];
  //       const stickerData = Stickers[key];
  //
  //       if (!stickerData) {
  //         console.warn(`Unknown sticker type: ${sticker}`);
  //         return null;
  //       }
  //
  //       return { index, sticker: key, rotation };
  //     }).filter(Boolean)
  //   );
  //
  //   const computedStart = data.sizeZ * (Math.trunc(data.sizeX / 2) + data.sizeX % 2 - 1);
  //   const computedFinish = data.sizeZ * (Math.trunc(data.sizeX / 2) + 1) - 1;
  //
  //   setStart(data.start !== null ? data.start : computedStart);
  //   setFinish(data.finish !== null ? data.finish : computedFinish);
  //   setLoaded(true);
  // }, [selectedTab]);

  // spremanje u local storage
  // useEffect(() => {
  //   if (!selectedTab || !loaded) return;
  //
  //   const current = localStorage.getItem(selectedTab);
  //   const parsed = current ? JSON.parse(current) : {};
  //
  //   const updated = {
  //     ...parsed,
  //     start,
  //     startRotationOffset,
  //     finish,
  //     barriers: [...barriers.entries()].map(([index, barrier]) => [
  //      index, Barriers[barrier].key
  //     ]),
  //     stickers: stickers.map(({ index, sticker, rotation }) => ({
  //       index,
  //       sticker: Stickers[sticker].key,
  //       rotation
  //     })),
  //   };
  //
  //   localStorage.setItem(selectedTab, JSON.stringify(updated));
  // }, [start, finish, barriers, stickers, selectedTab, loaded, startRotationOffset]);

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