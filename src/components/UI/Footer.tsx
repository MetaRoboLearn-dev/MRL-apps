import {FaPlay, FaStop, FaRobot} from "react-icons/fa";
import {useVehicle} from "../../hooks/useVehicle.ts";
import {MoveCommand} from "../../types.ts";
import {useCode} from "../../hooks/useCode.ts";
import {useUI} from "../../hooks/useUI.ts";
import {useSettings} from "../../hooks/useSettings.ts";
import {useGrid} from "../../hooks/useGrid.ts";
import {useState} from "react";
import {BsGearFill} from "react-icons/bs";

const Footer = () => {
  const { code } = useCode();
  const { queueMoves, moveQueue, isMoving, reset } = useVehicle();
  const { modalVisible } = useUI();
  const { setSimFocused, camMode, robotUrl, setRobotUrl } = useSettings();
  const { start, finish } = useGrid();

  const [urlInput, setUrlInput] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);

  const disabled = isMoving || modalVisible || start === null || finish === null;

  const changeRobotUrl = () => {
    setRobotUrl(urlInput)
    if (!urlInput) return;
    localStorage.setItem('robotUrl', urlInput);
    setEditingUrl(false);
  }

  const runCode = async (code: string) => {
    setSimFocused(false);
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
        queueMoves(processedSteps);
      }
    } catch (e) {
      if(e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  const runRobot = async (code: string) => {
    const url = robotUrl + "/execute";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ code: code }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        console.log('ok, ', code);
      }
    } catch (e) {
      if(e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  const abortRobot = async () => {
    const url = robotUrl + "/abort";
    try {
      const response = await fetch(url, {
        method: "POST",
      })
      if (!response.ok) {
        console.log('abort not ok');
      }
    } catch (e) {
      if(e instanceof Error) {
        console.error(e.message);
      }
    }

  }

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
      {robotUrl && !editingUrl ? (
        <>
          <button disabled={disabled}
                  className={`bg-dark-neutrals-100 text-dark-neutrals-400 font-display font-bold text-xl px-3 py-3 rounded flex items-center ml-2 
                          ${disabled ? 'bg-dark-neutrals-400 text-dark-neutrals-600' : 'hover:cursor-pointer hover:bg-dark-neutrals-200'} transition`}
                  onClick={() => {
                    setEditingUrl(true);
                    setUrlInput(robotUrl)
                  }}>
            <BsGearFill size={18} />
          </button>
          <button disabled={disabled}
                  className={`bg-tomato-500 text-light-cyan-200 font-display font-bold text-xl px-3 py-3 rounded flex items-center ml-2 
                    ${disabled ? 'bg-tomato-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-tomato-600'} transition`}
                  onClick={abortRobot}>
            <FaStop size={18}/>
          </button>

          <button disabled={disabled}
                  className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
                      ${disabled ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
                  onClick={() => runRobot(code)}>
            <FaRobot size={24}/>
            <span className={'ml-4'}>Upogoni</span>
          </button>
        </>
      ) : (
        <>
          <input type='text'
                 placeholder={'Unesite adresu'}
                 value={urlInput}
                 onChange={(e) => setUrlInput(e.target.value)}
                 className={'bg-light-cyan-50 p-2 rounded border-2 border-dark-neutrals-100 font-display'}/>
          <button disabled={disabled}
                  className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
                      ${disabled ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
                  onClick={changeRobotUrl}>
            <FaRobot size={24}/>
            <span className={'ml-4'}>Spoji se</span>
          </button>
        </>
      )}

      {!isMoving && moveQueue.length === 0 ? (
        <button disabled={disabled || camMode}
                className={`bg-turquoise-500 text-light-cyan-200 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                  ${disabled || camMode ? 'bg-turquoise-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-turquoise-600'} transition`}
                onClick={() => runCode(code)}>
          <FaPlay size={18}/>
          <span className={'ml-4'}>Simuliraj</span>
        </button>
      ) : (
        <>
          <button disabled={camMode}
                  className={`bg-tomato-500 text-light-cyan-200 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                    ${camMode ? 'bg-tomato-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-tomato-600'} transition`}
                  onClick={reset}>
            <FaStop size={18}/>
            <span className={'ml-4'}>Zaustavi</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Footer;