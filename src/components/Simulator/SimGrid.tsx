import SimCell from "./SimCell.tsx";
import {useState} from "react";
import SimVehicle from "./SimVehicle.tsx";
import {GridInfo} from "../../interfaces.tsx";

interface Props {
  size: number;
}

const calculatePosition = (index: number, grid: number) => {
  //  1rem = 16px
  const top = Math.trunc(index / grid) * 96 + 2;
  const left = (index % grid) * 96 + 2;
  return { top, left };
}

const SimGrid = ({ size } : Props) => {
  const border = 'border-2 border-solid border-turquoise-700';

  const [gridInfo, setGridInfo] = useState<GridInfo>({
    size: size,
    start: Math.trunc(size * size - size / 2 - 1 + size % 2),
    finish: Math.trunc(size / 2),
  });

  console.log(gridInfo)

  const [tankIndex, setTankIndex] = useState(gridInfo.start);

  console.log(tankIndex);

  const position = calculatePosition(gridInfo.start, gridInfo.size);

  return (
    <div className={"relative"}>
      <div className={`grid ${border} overflow-hidden`} style={{gridTemplateColumns: `repeat(${size}, 1fr)`}}>
        {Array.from({length: size * size}).map((_, index) => (
          <SimCell key={index} index={index} border={border} gridInfo={gridInfo} setGridInfo={setGridInfo}/>
        ))}
        <div className={`absolute pointer-events-none transition`}
             style={{ top: `${position.top}px`, left: `${position.left}px`, transition: 'top 0.3s ease, left 0.3s ease'}}>
          <SimVehicle/>
        </div>
      </div>
    </div>
  );
};

export default SimGrid;
