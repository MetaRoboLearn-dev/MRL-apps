import SimCell from "./SimCell.tsx";
import {useState} from "react";
import {CellType} from "../enums/CellTypes.tsx";

interface Props {
  size: number;
}

const SimGrid = ({ size } : Props) => {
  const border = 'border-2 border-solid border-emerald-700';
  const [holder, setHolder] = useState(-1);

  return (
    <>
      <div className={`grid ${border} overflow-hidden`} style={{gridTemplateColumns: `repeat(${size}, 1fr)`}}>
        {Array.from({length: size * size}).map((_, index) => (
          <SimCell key={index} init_type={CellType.Ground} index={index} holder={holder} setHolder={setHolder}
                   border={border}/>
        ))}
      </div>
    </>
  );
};

export default SimGrid;
