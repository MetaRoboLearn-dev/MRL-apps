import {abort_robot} from "../../api/robotApi.ts";
import {FaStop} from "react-icons/fa";
import {useSettings} from "../../hooks/useSettings.ts";
import {useToast} from "../../hooks/useToast.ts";

const ButtonRobotStop = ({disabled}: {disabled: boolean}) => {
  const { robotUrl } = useSettings();
  const { showToast } = useToast();

  const abort = async () => {
    const res = await abort_robot(robotUrl);
    if (res.error) {
      showToast(res.status + " " + res.statusText);
    }
  }

  return (
    <button disabled={disabled}
            className={`bg-tomato-500 text-light-cyan-200 button-square ml-2 
                    ${disabled ? 'bg-tomato-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-tomato-600'} transition`}
            onClick={abort}>
      <FaStop size={18}/>
    </button>
  );
};

export default ButtonRobotStop;