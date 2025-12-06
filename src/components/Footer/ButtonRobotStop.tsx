import {abort_robot} from "../../api/robotApi.ts";
import {FaStop} from "react-icons/fa";
import {useSettings} from "../../hooks/useSettings.ts";

const ButtonRobotStop = ({disabled}: {disabled: boolean}) => {
  const { robotUrl } = useSettings();

  return (
    <button disabled={disabled}
            className={`bg-tomato-500 text-light-cyan-200 button-square ml-2 
                    ${disabled ? 'bg-tomato-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-tomato-600'} transition`}
            onClick={() => abort_robot(robotUrl)}>
      <FaStop size={18}/>
    </button>
  );
};

export default ButtonRobotStop;