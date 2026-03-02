import {useVehicle} from "../../hooks/useVehicle.ts";
import {useUI} from "../../hooks/useUI.ts";
import {useTaskConfig} from "../../hooks/useTaskConfig.ts";
import {useGrid} from "../../hooks/useGrid.ts";
import {useState} from "react";
import ButtonSim from "../Footer/ButtonSim.tsx";
import ButtonSimStop from "../Footer/ButtonSimStop.tsx";
import ButtonRobotRun from "../Footer/ButtonRobotRun.tsx";
import ButtonRobotStop from "../Footer/ButtonRobotStop.tsx";
import TaskSaveButton from "../Task/TaskSaveButton.tsx";
import TaskDeleteButton from "../Task/TaskDeleteButton.tsx";
import TaskSubmitButton from "../Task/TaskSubmitButton.tsx";
import ButtonRobotSelect from "../Footer/ButtonRobotSelect.tsx";

// TODO - change the buttons, make it more neat
const Footer = () => {
  const { moveQueue, isMoving } = useVehicle();
  const { modalVisible } = useUI();
  const { camMode, awaitingReview, mode, hasRobotAccess } = useTaskConfig();
  const { start, finish } = useGrid();

  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const disabled = isMoving || modalVisible || start === null || finish === null;

  return (
    <div className={'bg-white-smoke-500 pr-15 w-full h-20 z-10 flex items-center justify-between select-none'}>
      <div>
        {mode !== "solve" && (
          <span className={'flex ml-5'}>
            <TaskSaveButton />
            <TaskDeleteButton />
          </span>
        )}
        {mode === 'solve' && (
          <TaskSubmitButton />
        )}
      </div>
      <div className={'flex'}>
        {hasRobotAccess && <>
          <ButtonRobotSelect
            disabled={disabled}
            selectedRobotId={selectedRobotId}
            onSelectRobot={setSelectedRobotId}
          />
          <ButtonRobotStop disabled={disabled} robot={selectedRobotId} />
          <ButtonRobotRun disabled={disabled || awaitingReview} robot={selectedRobotId} />
        </>}

        {!isMoving && moveQueue.length === 0 ? (
          <ButtonSim disabled={disabled || camMode} />
        ) : (
          <ButtonSimStop disabled={camMode} />
        )}
      </div>
    </div>
  );
};

export default Footer;