import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TaskProviders from "../providers/wrappers/TaskProviders";
import TaskScreen from "../components/Task/TaskScreen";

function SubmissionPreviewPage() {
  const [taskPayload, setTaskPayload] = useState<any>(null);

  useEffect(() => {
    window.parent.postMessage({ type: "READY" }, "*");

    function onMessage(event: MessageEvent) {
      if (event.data?.type === "LOAD_TASK") {
        setTaskPayload(event.data.payload);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!taskPayload) {
    return null;
  }

  const isBlockly = taskPayload.activity_task?.task_type === "blockly";
  const code = taskPayload.progress_code ?? taskPayload.initial_code ?? "";

  return (
    <TaskProviders
      ust={taskPayload}
      task={taskPayload.task}
      code={!isBlockly ? code : ""}
      blocks={isBlockly ? code : ""}
      mode={"preview_task"}
    >
      <TaskScreen />
    </TaskProviders>
  );
}

export const Route = createFileRoute("/submission")({
  component: SubmissionPreviewPage,
});
