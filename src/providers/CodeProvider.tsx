import {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {CodeContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";
import * as Blockly from "blockly";

export const CodeProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
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
      modeRef
    }}>
      {children}
    </CodeContext.Provider>
  );
};
