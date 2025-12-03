import { useRef, useEffect } from "react";
import * as Blockly from "blockly";
import customThemeGetter from "./BlockTheme.ts";
import toolbox from "./BlockToolbox.ts";
import {
  ContinuousToolbox,
  ContinuousFlyout,
  ContinuousMetrics,
  registerContinuousToolbox
} from "@blockly/continuous-toolbox";
import BlockCustom from "./BlockCustom.ts";
import { pythonGenerator } from "blockly/python";
import "./BlockCustomGenerator.ts";
import {useCode} from "../../hooks/useCode.ts";
// import {log_action} from "../../api/logApi.ts";

registerContinuousToolbox();
Blockly.common.defineBlocksWithJsonArray(BlockCustom);

const BlockPlayground = () => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);
  const { setCode, setBlocks, modeRef } = useCode();

  useEffect(() => {
    if (workspaceInstance.current) {
      setTimeout(() => Blockly.svgResize(workspaceInstance.current!), 50);
    }
  }, [modeRef.current]);

  useEffect(() => {
    if (!workspaceRef.current) return;
    const customTheme = customThemeGetter();

    workspaceInstance.current = Blockly.inject(workspaceRef.current, {
      plugins: {
        toolbox: ContinuousToolbox,
        flyoutsVerticalToolbox: ContinuousFlyout,
        metricsManager: ContinuousMetrics,
      },
      toolbox,
      theme: customTheme,
      maxInstances: { 'robot_start': 1 },
    });

    let timeout: ReturnType<typeof setTimeout>;
    const onWorkspaceChange = (event: Blockly.Events.Abstract) => {
      if (
        event.type === 'create' ||
        event.type === 'delete' ||
        event.type === 'change' ||
        event.type === 'move'
      ) {
        clearTimeout(timeout);
        const updateCode = () => {
          if (modeRef.current === 'python') {
            return;
          }

          const code = pythonGenerator.workspaceToCode(workspaceInstance.current!);
          const workspace = Blockly.getMainWorkspace();
          const xml = Blockly.Xml.workspaceToDom(workspace);
          const xmlText = Blockly.Xml.domToText(xml);

          setCode(code);
          setBlocks(xmlText);

          if (event.type !== 'move') return;
          console.log(xmlText);
          // log_action("grupa 1", "blockly", xmlText);
        };

        if (event.type !== 'move') {
          updateCode();
        } else {
          timeout = setTimeout(updateCode, 300);
        }
      }
    };

    workspaceInstance.current.addChangeListener(onWorkspaceChange);

    return () => {
      clearTimeout(timeout);
      if (workspaceInstance.current) {
        try {
          workspaceInstance.current.dispose();
        } catch (e) {
          console.warn('Workspace disposal error:', e);
        }
        workspaceInstance.current = null;
      }
    };
  }, []);

  return <div ref={workspaceRef} className="w-full h-full min-h-1/2 bg-white" />;
};

export default BlockPlayground;