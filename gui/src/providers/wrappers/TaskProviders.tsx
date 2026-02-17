import {VehicleProvider} from "../VehicleProvider.tsx";
import GridProvider from "../GridProvider.tsx";
import {CodeProvider} from "../CodeProvider.tsx";
import {PropsWithChildren} from "react";
import {TaskConfigProvider} from "../TaskConfigProvider.tsx";
import {Task} from "../../types/tasksTypes.ts";

interface Props {
  task: Task,
  edit?: boolean
}

const TaskProviders = ({task, edit, children}: PropsWithChildren<Props>) => {
  return (
    <TaskConfigProvider edit={edit}>
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