import {PropsWithChildren, useState} from "react";
import {GridContext} from "./Context.tsx";
import {Barrier, Sticker} from "../types.ts";
import {GridState, Task} from "../types/tasksTypes.ts";

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

  const buildGridState = (): GridState => {
    return {
      size_x: sizeX,
      size_z: sizeZ,
      start,
      start_rotation: startRotationOffset,
      finish,
      barriers: [...barriers.keys()],
      stickers: stickers.map(s => ({ index: s.index, sticker: s.sticker })),
    };
  }

  return (
    <GridContext.Provider value={{
      sizeX, setSizeX,
      sizeZ, setSizeZ,
      start, setStart,
      startRotationOffset, setStartRotationOffset,
      finish, setFinish,
      barriers, setBarriers,
      stickers, setStickers,
      buildGridState,
    }}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;