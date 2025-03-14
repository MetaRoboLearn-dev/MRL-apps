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

  border: string;
}

const SimCell = ({ index, init_type, holder, border }: Props) => {
  const images: Record<CellType, string | null> = {
    [CellType.GROUND]: null,
    [CellType.START]: start,
    [CellType.FINISH]: finish,
    [CellType.BARRIER]: barrier,
  };
  const [type, setType] = useState<CellType>(init_type);

  const place = () => {
    // setHolder(index)
    setType(CellType.START); // tu ce se settat type koji je u postavkama za editanje grida
  }

  return (
    <div className={`w-24 h-24 bg-turquoise-50 hover:bg-turquoise-100 ${border} select-none relative`}
         onClick={place}>

      {images[type] && <img src={images[type] as string} alt={type.toString()} className={"absolute z-0"}/>}

      {index === holder ? <img src={tank} alt="tank" className={"absolute z-10 p-2"}/> : null}
    </div>
  );
};

export default SimCell;
