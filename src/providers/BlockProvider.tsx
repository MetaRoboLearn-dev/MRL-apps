import {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {BlockContext} from "./Context.tsx";
import * as Blockly from "blockly";
import {useSettings} from "../hooks/useSettings.ts";

export const BlockProvider = ({children}: PropsWithChildren) => {
  const [blocks, setBlocks] = useState<string>('')
  const [loaded, setLoaded] = useState(false);

  const { selectedTab } = useSettings();

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

  useEffect(() => {
    if (!workspaceInstance.current) return;
    workspaceInstance.current.clear();

    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) {
      setBlocks('');
      setLoaded(true);
      return;
    }

    const data = JSON.parse(raw);

    setBlocks(data.blocks || '');

    if (data.blocks) {
      try {
        const xml = Blockly.utils.xml.textToDom(data.blocks);
        Blockly.Xml.domToWorkspace(xml, workspaceInstance.current);
      } catch (error) {
        console.error("Failed to load blocks from localStorage:", error);
      }
    }

    setLoaded(true);
  }, [selectedTab]);


  useEffect(() => {
    if (!selectedTab || !loaded) return;

    try {
      const current = localStorage.getItem(selectedTab);
      const parsed = current ? JSON.parse(current) : {};

      // Only update blocks, don't clear other data
      const updated = {
        ...parsed,
        blocks,
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [blocks, loaded, selectedTab]);

  return (
    <BlockContext.Provider value={{
      workspaceInstance,
      blocks, setBlocks,
      checkValidWorkspace,
      isValidWorkspace, setIsValidWorkspace,
      loaded, setLoaded
    }}>
      {children}
    </BlockContext.Provider>
  );
};