import {FaPlay, FaStop, FaRobot} from "react-icons/fa";
import {useVehicle} from "../../hooks/useVehicle.ts";
import {useCode} from "../../hooks/useCode.ts";
import {useUI} from "../../hooks/useUI.ts";
import {useSettings} from "../../hooks/useSettings.ts";
import {useGrid} from "../../hooks/useGrid.ts";
import {useState} from "react";
import {BsGearFill} from "react-icons/bs";
import * as Blockly from "blockly";
import {abort_robot, run_code, run_robot} from "../../api/robotApi.ts";
import {pythonGenerator} from "blockly/python";

const Footer = () => {
  const { codeRef, modeRef } = useCode();
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

  // ovo mozda cak stavit u codeProdiver
  const getCurrentCode = (): string => {
    if (modeRef.current === 'python') {
      return codeRef.current;
    } else {
      Blockly.hideChaff();
      const workspace = Blockly.getMainWorkspace();
      return pythonGenerator.workspaceToCode(workspace);
    }
  }

  const runCode = async () => {
    setSimFocused(false);
    const code = getCurrentCode();
    const steps = await run_code(code);
    if (steps) queueMoves(steps);
  }

  const runRobot = async () => {
    const code = getCurrentCode();
    await run_robot(code, robotUrl);
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
                  onClick={() => abort_robot(robotUrl)}>
            <FaStop size={18}/>
          </button>

          <button disabled={disabled}
                  className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
                      ${disabled ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
                  onClick={runRobot}>
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
                onClick={runCode}>
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