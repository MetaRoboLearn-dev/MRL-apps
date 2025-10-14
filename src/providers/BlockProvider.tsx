import React, {PropsWithChildren, useRef, useState} from 'react';
import {BlockContext} from "./Context.tsx";
import * as Blockly from "blockly";

export const BlockProvider = ({children}: PropsWithChildren) => {
  const [code, setCode] = useState<string>(null)
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);

  return (
    <BlockContext.Provider value={{
      workspaceInstance,
      code, setCode
    }}>
      {children}
    </BlockContext.Provider>
  );
};