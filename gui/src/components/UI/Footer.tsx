import {useVehicle} from "../../hooks/useVehicle.ts";
import {useUI} from "../../hooks/useUI.ts";
import {useTaskConfig} from "../../hooks/useTaskConfig.ts";
import {useGrid} from "../../hooks/useGrid.ts";
import {useState} from "react";
import ButtonSim from "../Footer/ButtonSim.tsx";
import ButtonSimStop from "../Footer/ButtonSimStop.tsx";
import ButtonRobotRun from "../Footer/ButtonRobotRun.tsx";
import ButtonRobotStop from "../Footer/ButtonRobotStop.tsx";
import ButtonSettings from "../Footer/ButtonSettings.tsx";
import ButtonConnect from "../Footer/ButtonConnect.tsx";
import TaskSaveButton from "../Task/TaskSaveButton.tsx";

// TODO - change the buttons, make it more neat
const Footer = () => {
  const { moveQueue, isMoving } = useVehicle();
  const { modalVisible } = useUI();
  const { camMode, robotUrl, awaitingReview, mode } = useTaskConfig();
  const { start, finish } = useGrid();

  const [urlInput, setUrlInput] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);

  const disabled = isMoving || modalVisible || start === null || finish === null;

  return (
    <div className={'bg-white-smoke-500 px-15 w-full h-20 z-10 flex items-center justify-end select-none'}>
      {mode !== "solve" && <TaskSaveButton />}
      {robotUrl && !editingUrl ? (
        <>
          <ButtonSettings disabled={disabled}
                          setEditingUrl={setEditingUrl}
                          setUrlInput={setUrlInput}/>
          <ButtonRobotStop disabled={disabled} />
          <ButtonRobotRun disabled={disabled || awaitingReview} />
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