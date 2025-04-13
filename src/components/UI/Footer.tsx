import {FaPlay, FaRobot} from "react-icons/fa";
import {useContext} from "react";
import {ActiveCodeContext} from "../../providers/Context.tsx";
import {useVehicle} from "../../hooks/useVehicle.ts";
import {MoveCommand} from "../../types.ts";

const Footer = () => {
  const [code, ] = useContext(ActiveCodeContext);
  const { queueMoves } = useVehicle();

  const runCode = async (code: string) => {
    const url = "http://127.0.0.1:8000/run-python";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ code: code }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const data = await response.json();
        const steps = data.output.split('\n');
        const processedSteps = processSteps(steps);
        console.log(processedSteps);
        queueMoves(processedSteps);
      }
    } catch (e) {
      if(e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  const simulate = () => {
    const steps = code.split('\n');
    const processedSteps = processSteps(steps);
    queueMoves(processedSteps);
  };

  const processSteps = (steps: string[]): MoveCommand[] => {
    return steps
      .filter(step => step.trim() !== '')
      .map(step => {
        const command = step.trim().toLowerCase();

        if (command === 'naprijed') {
          return { type: 'move', direction: 'forward' }
        }
        else if (command === 'nazad') {
          return { type: 'move', direction: 'backward' }
        }
        else if (command === 'lijevo') {
          return { type: 'rotate', direction: 'left' }
        }
        else if (command === 'desno') {
          return { type: 'rotate', direction: 'right' }
        }
        return { type: 'invalid', command }
      })
  }

  return (
    <div className={'bg-white-smoke-500 px-15 w-full h-20 z-10 flex items-center justify-end select-none'}>
      <div
        className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                    hover:cursor-pointer hover:bg-sunglow-600 transition`}
        onClick={simulate}>
        <FaRobot size={24}/>
        <span className={'ml-4'}>Upogoni</span>
      </div>
      <div
        className={`bg-turquoise-500 text-light-cyan-200 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                    hover:cursor-pointer hover:bg-turquoise-600 transition`}
        onClick={() => runCode(code)}>
        <FaPlay size={18}/>
        <span className={'ml-4'}>Simuliraj</span>
      </div>
    </div>
  );
};

export default Footer;