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

registerContinuousToolbox();
Blockly.common.defineBlocksWithJsonArray(BlockCustom);

const BlockPlayground = ({mode}: {mode: string}) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const currentModeRef = useRef<string>(mode);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);
  const { setCode, setBlocks } = useCode();

  useEffect(() => {
    currentModeRef.current = mode;
    if (workspaceInstance.current) {
      setTimeout(() => Blockly.svgResize(workspaceInstance.current!), 50);
    }
  }, [mode]);


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

    // Force a refresh of the toolbox
    // workspaceInstance.current.refreshToolboxSelection();

    setTimeout(() => Blockly.svgResize(workspaceInstance.current!), 50);

    let timeout: ReturnType<typeof setTimeout>;
    const onWorkspaceChange = (event: Blockly.Events.Abstract) => {
      if (
        event.type === 'create' ||
        event.type === 'delete' ||
        event.type === 'change' ||
        event.type === 'move'
      ) {
        // Clear any pending timeout
        clearTimeout(timeout);

        const updateCode = () => {
          if (currentModeRef.current === 'python') {
            return;
          }

          const code = pythonGenerator.workspaceToCode(workspaceInstance.current!);
          const workspace = Blockly.getMainWorkspace();
          const xml = Blockly.Xml.workspaceToDom(workspace);
          const xmlText = Blockly.Xml.domToText(xml);

          setCode(code);
          setBlocks(xmlText);
        };

        // Instant update for non-move events
        if (event.type !== 'move') {
          updateCode();
        } else {
          // Debounce move events for performance
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