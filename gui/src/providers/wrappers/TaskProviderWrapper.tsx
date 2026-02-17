import {VehicleProvider} from "../VehicleProvider.tsx";
import GridProvider from "../GridProvider.tsx";
import {CodeProvider} from "../CodeProvider.tsx";
import {PropsWithChildren} from "react";
import {SettingsProvider} from "../SettingsProvider.tsx";
import {Task} from "../../types/tasksTypes.ts";

interface Props {
  task: Task
}

const TaskProviderWrapper = ({task, children}: PropsWithChildren<Props>) => {
  return (
    <SettingsProvider>
      <GridProvider task={task}>
        <CodeProvider>
          <VehicleProvider>
            {children}
          </VehicleProvider>
        </CodeProvider>
      </GridProvider>
    </SettingsProvider>
  );
};

export default TaskProviderWrapper;