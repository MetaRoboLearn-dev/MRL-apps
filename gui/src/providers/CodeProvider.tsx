import {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {CodeContext} from "./Context.tsx";
import {useTaskConfig} from "../hooks/useTaskConfig.ts";
import * as Blockly from "blockly";
import {pythonGenerator} from "blockly/python";
import {MoveCommand} from "../types.ts";
import {run_code, run_robot} from "../api/robotApi.ts";
import {useToast} from "../hooks/useToast.ts";
import {useConsole} from "../hooks/useConsole.ts";

interface Props {
  init_code: string
  init_blocks: string
  editorMode?: string
  onSave?: (currentValue: string) => void;
}

export const CodeProvider = ({ init_code, init_blocks, editorMode, onSave, children }: PropsWithChildren<Props>) => {
  const { showToast } = useToast()
  const { addLog } = useConsole()
  const { setSimFocused, robotUrl, setAwaitingReview, ustId } = useTaskConfig();
  const [code, setCodeState] = useState<string>(init_code || '');
  const [blocks, setBlocksState] = useState<string>(init_blocks || '')

  const codeRef = useRef(init_code || '');
  const blocksRef = useRef(init_blocks || '');
  const modeRef = useRef(editorMode || '');

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

  const getCurrentValue = (): string => {
    if (modeRef.current === 'python') {
      return codeRef.current;
    } else {
      return blocksRef.current;
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
    const value = getCurrentValue();
    const compiled = await run_code(code, value, ustId);
    if (compiled.error){
      addLog("ERROR", compiled.error);
      return null
    }
    return processSteps(compiled.output.split('\n'));
  }

  const runRobot = async () => {
    const code = getCurrentCode();
    const res = await run_robot(code, robotUrl);
    if (res.error) {
      showToast(res.status + " " + res.statusText);
    }
    else {
      setAwaitingReview(true);
    }
  }

  useEffect(() => {
    if (!onSave) return;

    const timeout = setTimeout(() => {
      onSave(getCurrentValue());
    }, 500);

    return () => clearTimeout(timeout);
  }, [code, onSave]);

  useEffect(() => {
    if (!onSave) return;
    onSave(getCurrentValue());
    return;
  }, [blocks, onSave]);

  return (
    <CodeContext.Provider value={{
      code, setCode, codeRef,
      blocks, setBlocks, blocksRef,
      modeRef,
      getCurrentCode, getCurrentValue,
      runCode, runRobot,
    }}>
      {children}
    </CodeContext.Provider>
  );
};
