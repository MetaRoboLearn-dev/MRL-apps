import { createFileRoute } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import SimCanvas from "../../components/Simulator/Scene/SimCanvas";
import { CodeProvider } from "../../providers/CodeProvider";
import { ConsoleProvider } from "../../providers/ConsoleProvider";
import GridProvider from "../../providers/GridProvider";
import { TaskConfigProvider } from "../../providers/TaskConfigProvider";
import { VehicleProvider } from "../../providers/VehicleProvider";
import { Task, TaskMode } from "../../types/tasksTypes";

function taskFromPayload(p: Record<string, unknown>): Task {
  return {
    size_x: (p.sizeX as number) ?? 5,
    size_z: (p.sizeZ as number) ?? 5,
    start: (p.start as number) ?? null,
    rotation: (p.startRotationOffset as number) ?? 0,
    finish: (p.finish as number) ?? null,
    barriers: (p.barriers as Task["barriers"]) ?? [],
    stickers: (p.stickers as Task["stickers"]) ?? [],
    floor_color: (p.floorColor as string) ?? null,
    id: null,
    title: "",
    description: null,
    code: null,
    blocks: null,
    model_path: null,
    active: false,
  };
}

function MapPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [mode, setMode] = useState<TaskMode>("map_view");

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "MAP_VIEW") {
        setTask(taskFromPayload(event.data.payload));
        setMode("map_view");
      }
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "MAP_READY" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!task) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span>Učitavanje...</span>
      </div>
    );
  }

  return (
    <ConsoleProvider>
      <TaskConfigProvider task={task!} mode={mode}>
        <GridProvider task={task!}>
          <CodeProvider init_code="" init_blocks="">
            <VehicleProvider>
              <div className="h-screen w-full flex flex-col relative">
                <div className="bg-turquoise-50 flex-center flex-col flex-grow w-full border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden">
                  <SimCanvas />
                </div>
              </div>
            </VehicleProvider>
          </CodeProvider>
        </GridProvider>
      </TaskConfigProvider>
    </ConsoleProvider>
  );
}

export const Route = createFileRoute("/map/view")({
  component: MapPage,
});
