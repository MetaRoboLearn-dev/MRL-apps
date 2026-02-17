import {TaskConfigType} from "../types.ts";
import {useContext} from "react";
import {TaskConfigContext} from "../providers/Context.tsx";

export const useTaskConfig = (): TaskConfigType => {
  const context = useContext(TaskConfigContext);

  if (!context) {
    throw new Error('useSettings must be used within a TaskConfigProvider');
  }

  return context;
}