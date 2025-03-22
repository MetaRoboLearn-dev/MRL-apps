import start from '../../assets/start.png'
import finish from '../../assets/finish.png'
import barrier from '../../assets/barrier.png'
import {CellType} from "../../enums/CellTypes.tsx";
import {useContext, useState} from "react";
import {SimSettingsContext} from "../../Context.tsx";
import {GridInfo} from "../../interfaces.tsx";

interface Props {
  index: number;
  border: string;
  gridInfo: GridInfo;
  setGridInfo: (gridInfo: GridInfo) => void;
}

const SimCell = ({ index, border, gridInfo, setGridInfo }: Props) => {
  const images: Record<CellType, string | null> = {
    [CellType.GROUND]: null,
    [CellType.START]: start,
    [CellType.FINISH]: finish,
    [CellType.BARRIER]: barrier,
  };
  const [type, setType] = useState<CellType>(() => {
    if (index === gridInfo.start)
      return CellType.START;
    else if (index === gridInfo.finish)
      return CellType.FINISH;
    return CellType.GROUND;
  });
  const [simSettings] = useContext(SimSettingsContext);

  const place = () => {
    setGridInfo({
      ...gridInfo,
      start: index, // Update only start
    });
  }

  return (
    <div className={`w-24 h-24 bg-turquoise-50 hover:bg-turquoise-100 ${border} select-none relative`}
         onClick={() => {
           place();
         }}>
      {images[type] && <img src={images[type] as string} alt={type.toString()} className={"absolute z-0"}/>}
    </div>
  );
};

export default SimCell;
