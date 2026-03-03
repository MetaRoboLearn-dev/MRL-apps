import {PropsWithChildren, useEffect, useState} from "react";
import {TaskConfigContext} from "./Context.tsx";
import {Barrier, Barriers, Sticker, Stickers, TileType} from "../types.ts";
import {Texture, TextureLoader} from "three";
import {Task, TaskMode} from "../types/tasksTypes.ts";
import {UserStartedTask} from "../types/userStartedTasksTypes.ts";

interface Props {
  task: Task
  mode?: TaskMode
  ust?: UserStartedTask
}

export const TaskConfigProvider = ({ust, task, mode, children }: PropsWithChildren<Props>) => {
  // Grid editing options
  const [taskMode, setTaskMode] = useState<TaskMode>(mode || 'solve') // this is going to be true only while editing/creaing task
  const [selectedType, setSelectedType] = useState<TileType>(TileType.GROUND);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier>(Barrier.TREES);
  const [selectedRotation, setSelectedRotation] = useState<number>(0);

  // Task specific options
  const [title, setTitle] = useState<string>(task.title)
  const [description, setDescription] = useState<string | null>(task.description)
  const [isActive, setIsActive] = useState<boolean>(task.active);
  const [isLogged, setIsLogged] = useState<boolean>(ust?.activity_task.is_logged || false);
  const [hasRobotAccess, setHasRobotAccess] = useState<boolean>(ust?.activity_task.allows_robot || true)

  // Task solving specific options
  const ustId: number | null = ust?.id ?? null;

  // Generic options
  const [camMode, setCamMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [barriers3D, setBarriers3D] = useState<boolean>(false);
  const [simFocused, setSimFocused] = useState<boolean>(false);
  const [animationSpeed, setSpeed] = useState<number>(0.07);

  // TODO - check this out maybe it isnt needed
  const [textures, setTextures] = useState<Record<Sticker, Texture>>({} as Record<Sticker, Texture>);
  const [barrierTextures, setBarrierTextures] = useState<Record<Barrier, Texture>>({} as Record<Barrier, Texture>);

  // Robot related options
  // TODO - replace robot url with call from broker api and dropdown
  const [robotUrl, setRobotUrl] = useState<string | null>(null);
  const [awaitingReview, setAwaitingReview] = useState<boolean>(false);

  const setAnimationSpeed = (speed: number) => {
    // max 0.1, min 0.02, default 0.4
    setSpeed(speed / 1000);
  }

  const rotateBy90 = () => {
    const new_rot = selectedRotation + 90;
    if (new_rot >= 360)
      setSelectedRotation(0)
    else
      setSelectedRotation(new_rot)
  }

  // TODO - This is a BIG one, the dir /public is not used used properly here, it should only use STATIC images (research pls).
  //  Every non-static image should be in src/img, stuff like sticker and barrier images (but research aswell pls)
  //  Also what this does, it preloads all the stickers and barrier images so it doesn't flicker on every change
  //  (not sure why it happens but my guess is because its in /public)
  const loadTextures = () => {
    const loader = new TextureLoader();
    const textureMap: Record<string, Texture> = {};
    const entries = Object.entries(Stickers);
    let loadedCount = 0;
    const total = entries.length;

    entries.forEach(([key, sticker]) => {
      loader.load(sticker.image, (texture) => {
        textureMap[key] = texture;
        loadedCount++;
        if (loadedCount === total) {
          setTextures(textureMap);
        }
      });
    });
  };

  const loadBarrierTextures = () => {
    const loader = new TextureLoader();
    const textureMap: Record<string, Texture> = {};
    const entries = Object.entries(Barriers);
    let loadedCount = 0;
    const total = entries.length;

    entries.forEach(([key, barrier]) => {
      loader.load(barrier.image, (texture) => {
        textureMap[key] = texture;
        loadedCount++;
        if (loadedCount === total) {
          setBarrierTextures(textureMap);
        }
      });
    });
  }

  useEffect(() => {
    const raw = localStorage.getItem('robotUrl');
    if (!raw) setRobotUrl(null);

    setRobotUrl(raw);
  }, []);

  return (
    <TaskConfigContext.Provider value={{
      ustId,
      mode: taskMode, setMode: setTaskMode,
      selectedType, setSelectedType,
      selectedSticker, setSelectedSticker,
      selectedBarrier, setSelectedBarrier,
      selectedRotation, rotateBy90,
      camMode, setCamMode,
      editMode, setEditMode,
      barriers3D, setBarriers3D,
      simFocused, setSimFocused,
      animationSpeed, setAnimationSpeed,
      textures, loadTextures,
      barrierTextures, loadBarrierTextures,
      robotUrl, setRobotUrl,
      awaitingReview, setAwaitingReview,
      isLogged, setIsLogged,
      hasRobotAccess, setHasRobotAccess,
      isActive, setIsActive,
      title, setTitle,
      description, setDescription
    }}>
      {children}
    </TaskConfigContext.Provider>
  );
};