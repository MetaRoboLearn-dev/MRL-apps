import { useRef, useEffect } from "react";
import * as Blockly from "blockly";
import customTheme from "./BlockTheme.ts";
import toolbox from "./BlockToolbox.ts";
import {
  ContinuousToolbox,
  ContinuousFlyout,
  ContinuousMetrics,
  registerContinuousToolbox
} from "@blockly/continuous-toolbox";
import BlockCustom from "./BlockCustom.ts";
import { pythonGenerator } from "blockly/python";
import { useBlock } from "../../hooks/useBlock.ts";
import "./BlockCustomGenerator.ts";
import {useCode} from "../../hooks/useCode.ts";

registerContinuousToolbox();
Blockly.common.defineBlocksWithJsonArray(BlockCustom);

const BlockPlayground = ({mode}: {mode: string}) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const currentModeRef = useRef<string>(mode); // Track current mode with ref
  const { workspaceInstance, checkValidWorkspace, setIsValidWorkspace, setBlocks } = useBlock();
  const { setCode } = useCode();

  useEffect(() => {
    currentModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!workspaceRef.current) return;

    workspaceInstance.current = Blockly.inject(workspaceRef.current, {
      plugins: {
        toolbox: ContinuousToolbox,
        flyoutsVerticalToolbox: ContinuousFlyout,
        metricsManager: ContinuousMetrics,
      },
      toolbox,
      theme: customTheme,
      maxInstances: { 'motion_start': 1 },
    });

    let timeout: ReturnType<typeof setTimeout>;
    const onWorkspaceChange = (event: Blockly.Events.Abstract) => {
      if (
        event.type === 'create' ||
        event.type === 'delete' ||
        event.type === 'change' ||
        event.type === 'move'
      ) {

        timeout = setTimeout(() => {
          console.log(currentModeRef.current);
          if (currentModeRef.current === 'python') {
            clearTimeout(timeout);
            return;
          }

          const code = pythonGenerator.workspaceToCode(workspaceInstance.current!);
          const workspace = Blockly.getMainWorkspace();
          const xml = Blockly.Xml.workspaceToDom(workspace);
          const xmlText = Blockly.Xml.domToText(xml);

          setCode(code);
          setBlocks(xmlText);
          setIsValidWorkspace(checkValidWorkspace());
        }, 300);
      }
    };

    workspaceInstance.current.addChangeListener(onWorkspaceChange);

    return () => {
      clearTimeout(timeout);
      workspaceInstance.current?.dispose();
      workspaceInstance.current = null;
    };
  }, []);

  return <div ref={workspaceRef} className="w-full h-full bg-white" />;
};

export default BlockPlayground;
