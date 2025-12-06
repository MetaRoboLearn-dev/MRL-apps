import {FaRobot} from "react-icons/fa";
import {useCode} from "../../hooks/useCode.ts";

const ButtonRobotRun = ({disabled}: {disabled: boolean}) => {
  const { runRobot } = useCode();

  return (
    <button disabled={disabled}
            className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
                      ${disabled ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
            onClick={runRobot}>
      <FaRobot size={24}/>
      <span className={'ml-4'}>Upogoni</span>
    </button>
  );
};

export default ButtonRobotRun;