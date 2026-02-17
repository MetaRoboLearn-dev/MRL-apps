import {PropsWithChildren, useEffect, useState} from "react";
import {TaskConfigContext} from "./Context.tsx";
import {Barrier, Barriers, Sticker, Stickers, TileType} from "../types.ts";
import {Texture, TextureLoader} from "three";

interface Props {
  edit?: boolean
}

export const TaskConfigProvider = ({ edit, children }: PropsWithChildren<Props>) => {

  // Grid editing options
  const [isEdit, setIsEdit] = useState<boolean>(edit || false) // this is going to be true only while editing/creaing task
  const [selectedType, setSelectedType] = useState<TileType>(TileType.GROUND);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier>(Barrier.TREES);
  const [selectedRotation, setSelectedRotation] = useState<number>(0);

  // Generic options
  const [camMode, setCamMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [barriers3D, setBarriers3D] = useState<boolean>(false);
  const [simFocused, setSimFocused] = useState<boolean>(false);
  const [animationSpeed, setSpeed] = useState<number>(0.07);
  // TODO - add to task model
  const [isLogged, setIsLogged] = useState<boolean>(true) // by default true, but make sure its false while in editing/creating

  // TODO - check this out maybe it isnt needed
  const [textures, setTextures] = useState<Record<Sticker, Texture>>({} as Record<Sticker, Texture>);
  const [barrierTextures, setBarrierTextures] = useState<Record<Barrier, Texture>>({} as Record<Barrier, Texture>);

  // Robot related options
  // TODO - replace robot url with call from broker api and dropdown
  const [robotUrl, setRobotUrl] = useState<string | null>(null);
  const [awaitingReview, setAwaitingReview] = useState<boolean>(false);
  // TODO - add to task model
  const [hasRobotAccess, setHasRobotAccess] = useState<boolean>(true)

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
      isEdit, setIsEdit,
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
      awaitingReview, setAwaitingReview
    }}>
      {children}
    </TaskConfigContext.Provider>
  );
};