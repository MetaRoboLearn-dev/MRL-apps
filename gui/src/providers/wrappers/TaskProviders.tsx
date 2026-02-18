import {VehicleProvider} from "../VehicleProvider.tsx";
import GridProvider from "../GridProvider.tsx";
import {CodeProvider} from "../CodeProvider.tsx";
import {PropsWithChildren} from "react";
import {TaskConfigProvider} from "../TaskConfigProvider.tsx";
import {Task, TaskMode} from "../../types/tasksTypes.ts";

interface Props {
  task: Task,
  mode?: TaskMode
}

const TaskProviders = ({task, mode, children}: PropsWithChildren<Props>) => {
  return (
    <TaskConfigProvider task={task} mode={mode}>
      <GridProvider task={task}>
        <CodeProvider task={task}>
          <VehicleProvider>
            {children}
          </VehicleProvider>
        </CodeProvider>
      </GridProvider>
    </TaskConfigProvider>
  );
};

export default TaskProviders;