import tank from '../assets/tank.png'
import start from '../assets/start.png'
import finish from '../assets/finish.png'
import barrier from '../assets/barrier.png'
import {CellType} from "../enums/CellTypes.tsx";
import {useState} from "react";

interface Props {
  index: number;
  init_type: CellType;

  holder: number;
  setHolder: (index: number) => void;

  border: string;
}

const SimCell = ({ index, init_type, holder, setHolder, border }: Props) => {
  const images: Record<CellType, string | null> = {
    [CellType.Ground]: null,
    [CellType.Start]: start,
    [CellType.Finish]: finish,
    [CellType.Barrier]: barrier,
  };
  const [type, setType] = useState<CellType>(init_type);

  const place = () => {
    // setHolder(index)
    setType(CellType.Start); // tu ce se settat type koji je u postavkama za editanje grida
  }

  return (
    <div className={`w-24 h-24 bg-emerald-50 hover:bg-emerald-100 ${border} select-none relative`}
         onClick={place}>

      {images[type] && <img src={images[type] as string} alt={type.toString()} className={"absolute z-0"}/>}

      {index === holder ? <img src={tank} alt="tank" className={"absolute z-10 p-2"}/> : null}
    </div>
  );
};

export default SimCell;
