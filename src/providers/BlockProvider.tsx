import {PropsWithChildren, useRef, useState} from 'react';
import {BlockContext} from "./Context.tsx";
import * as Blockly from "blockly";

export const BlockProvider = ({children}: PropsWithChildren) => {
  const [code, setCode] = useState<string>('')
  // TODO - implementirat ovaj check u tipku za simuliranje
  const [isValidWorkspace, setIsValidWorkspace] = useState<boolean>(false);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);

  const checkValidWorkspace = () => {
    if (!workspaceInstance.current) return false;

    const workspace = Blockly.getMainWorkspace();
    const topBlocks = workspace.getTopBlocks();
    // const allBlocks = workspace.getAllBlocks();

    // TODO - ovaj dio treba regulirat jer postoje funkcije
    if (topBlocks.length !== 1) return false;

    if (topBlocks[0].type != 'motion_start') return false;

    // TODO - pogledat kak da ovo napravim pravilo, jer ima svakakvih vrsti blockova
    // const endingBlocks = allBlocks.filter(block => block.getNextBlock() === null);
    // const allEndWithStop = endingBlocks.every(block => block.type === 'motion_stop');
    //
    // if (!allEndWithStop) return false;

    return true;
  }

  return (
    <BlockContext.Provider value={{
      workspaceInstance,
      code, setCode,
      checkValidWorkspace,
      isValidWorkspace, setIsValidWorkspace
    }}>
      {children}
    </BlockContext.Provider>
  );
};