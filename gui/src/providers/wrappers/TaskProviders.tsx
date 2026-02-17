import {VehicleProvider} from "../VehicleProvider.tsx";
import GridProvider from "../GridProvider.tsx";
import {CodeProvider} from "../CodeProvider.tsx";
import {PropsWithChildren} from "react";
import {TaskConfigProvider} from "../TaskConfigProvider.tsx";
import {Task} from "../../types/tasksTypes.ts";

interface Props {
  task: Task
}

const TaskProviders = ({task, children}: PropsWithChildren<Props>) => {
  return (
    <TaskConfigProvider>
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