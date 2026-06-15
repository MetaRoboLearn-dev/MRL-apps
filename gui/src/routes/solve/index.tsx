import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUserStartedTask,
  getUserStartedTaskByAssignment,
  updateUserStartedTask,
} from "../../api/userStartedTaskApi";
import TaskScreen from "../../components/Task/TaskScreen";
import TaskProviders from "../../providers/wrappers/TaskProviders";

export const Route = createFileRoute("/solve/")({
  component: RouteComponent,
});

const actTaskQueryOptions = (assignmentId: string) =>
  queryOptions({
    queryKey: ["actTask", assignmentId],
    queryFn: () => getUserStartedTaskByAssignment(assignmentId),
    staleTime: 0,
    gcTime: 0,
    enabled: !!assignmentId,
  });

function RouteComponent() {
  const [taskPayload, setTaskPayload] = useState<any>(null);
  const taskPayloadRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const { data: existingUst } = useQuery({
    ...actTaskQueryOptions(taskPayload?.assignment_id ?? ""),
    enabled: !!taskPayload?.assignment_id,
  });

  const createMutation = useMutation({
    mutationFn: (assignment_id: string) =>
      createUserStartedTask(
        undefined,
        assignment_id,
        taskPayloadRef.current?.initial_code,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["actTask", taskPayloadRef.current?.assignment_id],
      });
    },
  });

  useEffect(() => {
    window.parent.postMessage({ type: "READY" }, "*");

    function onMessage(event: MessageEvent) {
      if (event.data?.type === "LOAD_TASK") {
        const payload = event.data.payload;
        taskPayloadRef.current = payload;
        setTaskPayload(payload);
        if (payload.is_new && payload.assignment_id) {
          createMutation.mutate(payload.assignment_id);
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const existingUstRef = useRef<any>(null);

  useEffect(() => {
    existingUstRef.current = existingUst;
  }, [existingUst]);

  const handleSave = useCallback((currentValue: string) => {
    const ustId = existingUstRef.current?.id;
    if (!ustId) return;
    updateUserStartedTask(ustId, { current_value: currentValue });
  }, []);

  if (!taskPayload) return null;
  if (!taskPayload.is_new && !existingUst) return null;

  const progressCode = existingUst
    ? (existingUst.current_value ?? taskPayload.initial_code)
    : (taskPayload.progress_code ?? taskPayload.initial_code);

  const ust = existingUst
    ? { ...existingUst, activity_task: taskPayload.activity_task }
    : taskPayload;

  const isBlockly = taskPayload.activity_task?.task_type === "blockly";

  return (
    <TaskProviders
      ust={ust}
      task={taskPayload.task}
      code={!isBlockly ? progressCode : ""}
      blocks={isBlockly ? progressCode : ""}
      mode={"solve"}
      onCodeSave={handleSave}
    >
      <TaskScreen />
    </TaskProviders>
  );
}
