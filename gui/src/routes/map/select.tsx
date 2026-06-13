import { createFileRoute, useSearch } from "@tanstack/react-router";
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
import SimInterface from "../../components/Simulator/UI/SimInterface.tsx";
import { TileType } from "../../types.ts";
import { useGrid } from "../../hooks/useGrid.ts";
import { useTaskConfig } from "../../hooks/useTaskConfig.ts";

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

function MapSelectInner({ mode }: { mode: "start" | "finish" }) {
  const { start, finish, startRotationOffset } = useGrid();
  const { setSelectedType } = useTaskConfig();

  useEffect(() => {
    setSelectedType(mode === "start" ? TileType.START : TileType.FINISH);
  }, [mode]);

  useEffect(() => {
    if (mode === "start" && start !== null) {
      window.parent.postMessage(
        {
          type: "MAP_CELL_CLICK",
          payload: { row: start, rotation: startRotationOffset },
        },
        "*",
      );
    }
  }, [start, startRotationOffset]);

  useEffect(() => {
    if (mode === "finish" && finish !== null) {
      window.parent.postMessage(
        { type: "MAP_CELL_CLICK", payload: { row: finish, rotation: 0 } },
        "*",
      );
    }
  }, [finish]);

  return (
    <div className="h-screen w-full flex flex-col relative">
      <div className="bg-turquoise-50 flex-center flex-col flex-grow w-full border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden">
        <SimCanvas />
        <SimInterface isHovered={true} />
      </div>
    </div>
  );
}

function MapSelectPage() {
  const [task, setTask] = useState<Task | null>(null);
  const { fetchPackStickers } = useStickerPacks();
  const search = useSearch({ from: "/map/select" }) as { mode?: string };
  const mode = (search.mode === "finish" ? "finish" : "start") as
    | "start"
    | "finish";

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      if (event.data?.type !== "MAP_START_FINISH") return;

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
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "MAP_READY" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!task) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid #0d9488",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <ConsoleProvider>
      <TaskConfigProvider task={task} mode={mode}>
        <GridProvider task={task}>
          <CodeProvider init_code="" init_blocks="">
            <VehicleProvider>
              <MapSelectInner mode={mode} />
            </VehicleProvider>
          </CodeProvider>
        </GridProvider>
      </TaskConfigProvider>
    </ConsoleProvider>
  );
}

export const Route = createFileRoute("/map/select")({
  component: MapSelectPage,
});
