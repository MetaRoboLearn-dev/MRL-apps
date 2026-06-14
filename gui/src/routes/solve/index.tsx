import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserStartedTask } from "../../api/userStartedTaskApi";
import TaskScreen from "../../components/Task/TaskScreen";
import TaskProviders from "../../providers/wrappers/TaskProviders";
export const Route = createFileRoute("/solve/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [taskPayload, setTaskPayload] = useState<any>(null);

  useEffect(() => {
    window.parent.postMessage({ type: "READY" }, "*");

    function onMessage(event: MessageEvent) {
      if (event.data?.type === "LOAD_TASK") {
        setTaskPayload(event.data.payload);
        console.log(event.data.payload);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // const saveMutation = useMutation({
  //   mutationFn: (currentValue: string) =>
  //     updateUserStartedTask(taskPayload.assignment_id, {
  //       current_value: currentValue,
  //     }),
  // });

  const handleSave = useCallback(
    (currentValue: string) => {
      //   saveMutation.mutate(currentValue);
      console.log(currentValue);
    },
    [taskPayload?.assignment_id],
  );

  if (!taskPayload) {
    return null;
  }

  return (
    <TaskProviders
      ust={taskPayload}
      task={taskPayload.task}
      code={
        !taskPayload.activity_task.task_type ||
        taskPayload.activity_task.task_type === "python"
          ? taskPayload.initial_code
          : ""
      }
      blocks={
        taskPayload.activity_task.task_type === "blockly"
          ? taskPayload.initial_code
          : ""
      }
      mode={"solve"}
      onCodeSave={handleSave}
    >
      <TaskScreen />
    </TaskProviders>
  );
}
