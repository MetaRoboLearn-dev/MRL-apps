import {useVehicle} from "../../hooks/useVehicle.ts";
import {useUI} from "../../hooks/useUI.ts";
import {useSettings} from "../../hooks/useSettings.ts";
import {useGrid} from "../../hooks/useGrid.ts";
import {useState} from "react";
import ButtonSim from "../Footer/ButtonSim.tsx";
import ButtonSimStop from "../Footer/ButtonSimStop.tsx";
import ButtonRobotRun from "../Footer/ButtonRobotRun.tsx";
import ButtonRobotStop from "../Footer/ButtonRobotStop.tsx";
import ButtonSettings from "../Footer/ButtonSettings.tsx";
import ButtonConnect from "../Footer/ButtonConnect.tsx";

// TODO - change the buttons, make it more neat
const Footer = () => {
  const { moveQueue, isMoving } = useVehicle();
  const { modalVisible } = useUI();
  const { camMode, robotUrl } = useSettings();
  const { start, finish } = useGrid();

  const [urlInput, setUrlInput] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);

  const disabled = isMoving || modalVisible || start === null || finish === null;

  return (
    <div className={'bg-white-smoke-500 px-15 w-full h-20 z-10 flex items-center justify-end select-none'}>
      {robotUrl && !editingUrl ? (
        <>
          <ButtonSettings disabled={disabled}
                          setEditingUrl={setEditingUrl}
                          setUrlInput={setUrlInput}/>
          <ButtonRobotStop disabled={disabled} />
          <ButtonRobotRun disabled={disabled} />
        </>
      ) : (
        <ButtonConnect disabled={disabled}
                       urlInput={urlInput}
                       setUrlInput={setUrlInput}
                       setEditingUrl={setEditingUrl} />
      )}

      {!isMoving && moveQueue.length === 0 ? (
        <ButtonSim disabled={disabled || camMode} />
      ) : (
        <ButtonSimStop disabled={camMode} />
      )}
    </div>
  );
};

export default Footer;