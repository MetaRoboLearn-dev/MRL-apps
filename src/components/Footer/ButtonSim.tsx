import {FaPlay} from "react-icons/fa";
import {useCode} from "../../hooks/useCode.ts";
import {useVehicle} from "../../hooks/useVehicle.ts";

const ButtonSim = ({disabled}: {disabled: boolean}) => {
  const { runCode } = useCode();
  const { queueMoves } = useVehicle();

  return (
    <button disabled={disabled }
            className={`bg-turquoise-500 text-light-cyan-200 button-lg ml-8
                  ${disabled ? 'bg-turquoise-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-turquoise-600'} transition`}
            onClick={() => {
              runCode().then((moves) => {
                if (moves) {
                  queueMoves(moves);
                }
              });
            }}>
      <FaPlay size={18}/>
      <span className={'ml-4'}>Simuliraj</span>
    </button>
  );
};

export default ButtonSim;