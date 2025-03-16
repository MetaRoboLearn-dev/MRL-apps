import start from '../assets/start.png'
import finish from '../assets/finish.png'
import barrier from '../assets/barrier.png'
import {CellType} from "../enums/CellTypes.tsx";
import {useContext, useState} from "react";
import {SimSettingsContext} from "../Context.tsx";

interface Props {
  index: number;
  border: string;
  moveVehicle: (index: number) => void;
}

const SimCell = ({ index, border, moveVehicle }: Props) => {
  const images: Record<CellType, string | null> = {
    [CellType.GROUND]: null,
    [CellType.START]: start,
    [CellType.FINISH]: finish,
    [CellType.BARRIER]: barrier,
  };
  const [type, setType] = useState<CellType>(CellType.GROUND);
  const [simSettings] = useContext(SimSettingsContext);

  const place = () => {
    setType(simSettings.cellType);
  }

  return (
    <div className={`w-24 h-24 bg-turquoise-50 hover:bg-turquoise-100 ${border} select-none relative`}
         onClick={() => {
           place();
           moveVehicle(index);
         }}>

      {images[type] && <img src={images[type] as string} alt={type.toString()} className={"absolute z-0"}/>}
    </div>
  );
};

export default SimCell;
