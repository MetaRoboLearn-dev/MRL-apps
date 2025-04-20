import {PropsWithChildren, useEffect, useState} from "react";
import {GridContext} from "./Context.tsx";

const GridProvider = ({ children }: PropsWithChildren) => {
  const [sizeX, setSizeX] = useState<number>(5);
  const [sizeZ, setSizeZ] = useState<number>(6);
  const [start, setStart] = useState<number | null>(sizeZ * (Math.trunc(sizeX / 2) + sizeX % 2 - 1));
  const [finish, setFinish] = useState<number | null>(sizeZ * (Math.trunc(sizeX / 2) + 1) - 1);
  const [barriers, setBarriers] = useState<number[]>([0, 1, 2, 6, 7, 8, 10, 13, 14, 16, 19, 20, 22, 23]);

  useEffect(() => {
    setStart(sizeZ * (Math.trunc(sizeX / 2) + sizeX % 2 - 1));
    setFinish(sizeZ * (Math.trunc(sizeX / 2) + 1) - 1);
  }, [sizeX, sizeZ]);

  return (
    <GridContext.Provider value={{
      sizeX, setSizeX,
      sizeZ, setSizeZ,
      start, setStart,
      finish, setFinish,
      barriers, setBarriers
    }}>
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;