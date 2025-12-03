import {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {CodeContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";
import * as Blockly from "blockly";
import {pythonGenerator} from "blockly/python";
import {MoveCommand} from "../types.ts";
import {Action, log_action} from "../api/logApi.ts";
import {run_code, run_robot} from "../api/robotApi.ts";

export const CodeProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
  const { setSimFocused, robotUrl, groupName } = useSettings();
  const [code, setCodeState] = useState<string>('');
  const [blocks, setBlocksState] = useState<string>('')
  const [loaded, setLoaded] = useState(false);

  const codeRef = useRef('');
  const blocksRef = useRef('');
  const modeRef = useRef('');

  const setCode = useCallback((code: string) => {
    setCodeState(code);
    codeRef.current = code;
  }, []);

  const setBlocks = useCallback((blocks: string) => {
    setBlocksState(blocks);
    blocksRef.current = blocks;
  }, []);

  const getCurrentCode = (): string => {
    if (modeRef.current === 'python') {
      return codeRef.current;
    } else {
      Blockly.hideChaff();
      const workspace = Blockly.getMainWorkspace();
      return pythonGenerator.workspaceToCode(workspace);
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

  const runCode = async () => {
    setSimFocused(false);
    const code = getCurrentCode();
    log_action(groupName, modeRef.current, Action.SIM_RUN, code)
    const compiled = await run_code(code);

    if (compiled.error){
      log_action(groupName, modeRef.current, Action.CODE_ERR, code)
      return null;
    }
    return processSteps(compiled.output.split('\n'));
    // if (steps) queueMoves(steps);
  }

  const runRobot = async () => {
    const code = getCurrentCode();
    log_action(groupName, modeRef.current, Action.ROBOT_RUN, code)
    await run_robot(code, robotUrl);
  }

  // TODO - implementirat ovaj check u tipku za simuliranje
  // i pliz razmisli jel stvarno zelis da ovo bude tu
  // const [isValidWorkspace, setIsValidWorkspace] = useState<boolean>(false);
  //
  // const checkValidWorkspace = () => {
  //   const workspace = Blockly.getMainWorkspace();
  //   if (!workspace) return false;
  //
  //   const topBlocks = workspace.getTopBlocks();
  //   // const allBlocks = workspace.getAllBlocks();
  //
  //   // TODO - ovaj dio treba regulirat jer postoje funkcije
  //   if (topBlocks.length !== 1) return false;
  //
  //   if (topBlocks[0].type != 'motion_start') return false;
  //
  //   // TODO - pogledat kak da ovo napravim pravilo, jer ima svakakvih vrsti blockova
  //   // const endingBlocks = allBlocks.filter(block => block.getNextBlock() === null);
  //   // const allEndWithStop = endingBlocks.every(block => block.type === 'motion_stop');
  //   //
  //   // if (!allEndWithStop) return false;
  //
  //   return true;
  // }

  // Loading code and blocks from localStorage
  useEffect(() => {
    const blockly_workspace = Blockly.getMainWorkspace();
    if (!blockly_workspace) return
    blockly_workspace.clear();

    setLoaded(false);

    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) {
      setCode('');
      setBlocks('')
      setLoaded(true);
      return
    }

    const data = JSON.parse(raw);

    setCode(data.code || '');
    setBlocks(data.blocks || '');
    modeRef.current = data.mode;

    if (data.blocks) {
      const xml = Blockly.utils.xml.textToDom(data.blocks);
      Blockly.Xml.domToWorkspace(xml, blockly_workspace);
    }

    setLoaded(true)
  }, [selectedTab]);

  // Saving code changes to localStorage
  useEffect(() => {
    if (!selectedTab || !loaded) return;

    try {
      const current = localStorage.getItem(selectedTab);
      const parsed = current ? JSON.parse(current) : {};

      const updated = {
        ...parsed,
        code: codeRef.current,
        blocks: blocksRef.current,
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [code]);

  // Saving block changes to localStorage
  useEffect(() => {
    if (!selectedTab || !loaded) return;

    try {
      const current = localStorage.getItem(selectedTab);
      const parsed = current ? JSON.parse(current) : {};

      const updated = {
        ...parsed,
        blocks: blocksRef.current,
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [blocks]);

  return (
    <CodeContext.Provider value={{
      code, setCode, codeRef,
      blocks, setBlocks, blocksRef,
      modeRef,
      getCurrentCode,
      runCode, runRobot,
    }}>
      {children}
    </CodeContext.Provider>
  );
};
