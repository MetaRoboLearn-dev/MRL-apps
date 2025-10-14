import { useRef, useEffect } from "react";
import * as Blockly from "blockly";
import customTheme from "./BlockTheme.ts";
import toolbox from "./BlockToolbox.ts";
import {
  ContinuousToolbox,
  ContinuousFlyout,
  ContinuousMetrics, registerContinuousToolbox
} from "@blockly/continuous-toolbox";
import BlockCustom from "./BlockCustom.ts";
import { pythonGenerator } from "blockly/python";
import {useBlock} from "../../hooks/useBlock.ts";

const BlockPlayground = () => {
  registerContinuousToolbox();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { workspaceInstance, setCode } = useBlock();

  useEffect(() => {
    if (workspaceRef.current && !workspaceInstance.current) {
      Blockly.common.defineBlocksWithJsonArray(BlockCustom);
      // Initialize Blockly workspace
      workspaceInstance.current = Blockly.inject(workspaceRef.current, {
        plugins: {
          toolbox: ContinuousToolbox,
          flyoutsVerticalToolbox: ContinuousFlyout,
          metricsManager: ContinuousMetrics,
        },
        toolbox: toolbox,
        theme: customTheme,
      });
    }

    return () => {
      // Cleanup on unmount
      if (workspaceInstance.current) {
        workspaceInstance.current.dispose();
        workspaceInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={workspaceRef}
      className="w-full h-full bg-white "
    />
  );
};

export default BlockPlayground;