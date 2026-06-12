import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SimCanvas from "../../components/Simulator/Scene/SimCanvas";
import SimInterface from "../../components/Simulator/UI/SimInterface";
import { useGrid } from "../../hooks/useGrid";
import { CodeProvider } from "../../providers/CodeProvider";
import { ConsoleProvider } from "../../providers/ConsoleProvider";
import GridProvider from "../../providers/GridProvider";
import { TaskConfigProvider } from "../../providers/TaskConfigProvider";
import { VehicleProvider } from "../../providers/VehicleProvider";
import { Barrier, Barriers, Stickers } from "../../types";
import { Task, TaskMode } from "../../types/tasksTypes";

const EMPTY_MAP_TASK: Task = {
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
  active: true,
};

function taskFromPayload(p: Record<string, unknown>): Task {
  return {
    ...EMPTY_MAP_TASK,
    size_x: (p.sizeX as number) ?? 5,
    size_z: (p.sizeZ as number) ?? 5,
    start: (p.start as number) ?? null,
    rotation: (p.startRotationOffset as number) ?? 0,
    finish: (p.finish as number) ?? null,
    barriers: (p.barriers as Task["barriers"]) ?? [],
    stickers: (p.stickers as Task["stickers"]) ?? [],
    floor_color: (p.floorColor as string) ?? null,
  };
}

function barrierValueToKey(value: Barrier): string {
  return Barriers[value]?.key ?? value;
}

function stickerValueToKey(value: string): string {
  const byEnumValue = Object.entries(Stickers).find(
    ([enumVal]) => enumVal === value,
  );
  if (byEnumValue) return byEnumValue[1].key;

  const byKey = Object.values(Stickers).find((s) => s.key === value);
  if (byKey) return byKey.key;

  const byImage = Object.values(Stickers).find((s) => s.image.includes(value));
  if (byImage) return byImage.key;

  return value;
}

function SaveButton() {
  const {
    sizeX,
    sizeZ,
    start,
    startRotationOffset,
    finish,
    barriers,
    stickers,
    floorColor,
  } = useGrid();

  function handleSave() {
    const barriersPayload: [number, string][] = [...barriers.entries()].map(
      ([index, barrierValue]) => [index, barrierValueToKey(barrierValue)],
    );

    const stickersPayload = stickers.map((s) => ({
      index: s.index,
      sticker: stickerValueToKey(s.sticker as string),
      rotation: s.rotation,
    }));

    const layout = {
      sizeX,
      sizeZ,
      start,
      startRotationOffset,
      finish,
      floorColor,
      barriers: barriersPayload,
      stickers: stickersPayload,
    };

    window.parent.postMessage({ type: "MAP_SAVED", payload: layout }, "*");
  }

  return (
    <button
      onClick={handleSave}
      className="absolute top-4 right-4 z-50 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg font-semibold"
    >
      Spremi mapu
    </button>
  );
}

function MapPage() {
  const [task, setTask] = useState<Task>(EMPTY_MAP_TASK);
  const [mode, setMode] = useState<TaskMode>("map_edit");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "MAP_EDIT") {
        setTask(taskFromPayload(event.data.payload));
        setMode("map_edit");
      }
    }
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "MAP_READY" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <ConsoleProvider>
      <TaskConfigProvider task={task} mode={mode}>
        <GridProvider task={task}>
          <CodeProvider init_code="" init_blocks="">
            <VehicleProvider>
              <div className="h-screen w-full flex flex-col relative">
                <div
                  className="bg-turquoise-50 flex-center flex-col flex-grow w-full border-t-8 border-y-10 border-turquoise-700 relative overflow-hidden"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <SimCanvas />
                  <SimInterface isHovered={isHovered} />
                </div>
                <SaveButton />
              </div>
            </VehicleProvider>
          </CodeProvider>
        </GridProvider>
      </TaskConfigProvider>
    </ConsoleProvider>
  );
}

export const Route = createFileRoute("/map")({
  component: MapPage,
});