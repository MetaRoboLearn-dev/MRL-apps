import SimCell from "./SimCell.tsx";
import {useState} from "react";
import SimVehicle from "./SimVehicle.tsx";

interface Props {
  size: number;
}

const SimGrid = ({ size } : Props) => {
  const border = 'border-2 border-solid border-turquoise-700';

  // State to track tank's current position
  const [tankIndex, setTankIndex] = useState(22);

  const calculatePosition = (index: number, grid: number) => {
  //   1rem = 16px
    const top = Math.trunc(index / grid) * 96 + 2;
    const left = (index % grid) * 96 + 2;

    console.log(`top: ${top}px, left: ${left}px`);
    return { top, left };
  }

  const handleCellClick = (index: number) => {
    setTankIndex(index);
  };

  const position = calculatePosition(tankIndex, size);

  return (
    <div className={"relative"}>
      <div className={`grid ${border} overflow-hidden`} style={{gridTemplateColumns: `repeat(${size}, 1fr)`}}>
        {Array.from({length: size * size}).map((_, index) => (
          <SimCell key={index} index={index} moveVehicle={handleCellClick} border={border}/>
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
