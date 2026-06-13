import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import SimCanvas from "../../components/Simulator/Scene/SimCanvas";
import { CodeProvider } from "../../providers/CodeProvider";
import { ConsoleProvider } from "../../providers/ConsoleProvider";
import GridProvider from "../../providers/GridProvider";
import { TaskConfigProvider } from "../../providers/TaskConfigProvider";
import { VehicleProvider } from "../../providers/VehicleProvider";
import { isPackStickerKey } from "../../api/stickerPackApi.ts";

import { Task, TaskMode } from "../../types/tasksTypes";
import { useStickerPacks } from "../../hooks/useStickerPacks";

const EMPTY_TASK: Task = {
  id: null,
  title: "",
  description: null,
  size_x: 5,
  size_z: 5,
  start: null,
  rotation: 0,
  finish: null,
  barriers: [],
  stickers: [],
  code: null,
  blocks: null,
  floor_color: null,
  model_path: null,
  active: false,
};

function taskFromPayload(payload: Record<string, any>): Task {
  return {
    ...EMPTY_TASK,

    size_x: Number(payload.sizeX ?? 5),
    size_z: Number(payload.sizeZ ?? 5),

    start: payload.start ?? null,
    rotation: Number(payload.startRotationOffset ?? 0),
    finish: payload.finish ?? null,

    floor_color: payload.floorColor ?? null,

    barriers: Array.isArray(payload.barriers)
      ? payload.barriers.map((b: any) => [Number(b[0]), String(b[1])])
      : [],

    stickers: Array.isArray(payload.stickers)
      ? payload.stickers.map((s: any) => ({
          index: Number(s.index),
          sticker: String(s.sticker),
          rotation: Number(s.rotation ?? 0),
        }))
      : [],
  };
}

function MapPage() {
  const [task, setTask] = useState<Task>(EMPTY_TASK);
  const [mode] = useState<TaskMode>("map_view");
  const [packsReady, setPacksReady] = useState(false);
  const { fetchPackStickers } = useStickerPacks(); // your context

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "MAP_VIEW") return;

      const parsedTask = taskFromPayload(event.data.payload);

      const packNames = [
        ...new Set(
          (parsedTask.stickers ?? [])
            .map((s) => s.sticker)
            .filter(isPackStickerKey)
            .map((key) => key.split("/")[0]),
        ),
      ];

      await Promise.all(packNames.map(fetchPackStickers));

      setTask(parsedTask);
      setPacksReady(true);
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "MAP_READY" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <ConsoleProvider>
      <TaskConfigProvider task={task} mode={mode}>
        <GridProvider task={task}>
          <CodeProvider init_code="" init_blocks="">
            <VehicleProvider>
              <div className="h-screen w-full flex flex-col relative">
                <div className="bg-turquoise-50 flex-center flex-col flex-grow w-full border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden">
                  {packsReady && <SimCanvas />}
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
