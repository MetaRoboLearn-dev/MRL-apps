import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSettings } from "../../../hooks/useSettings.ts";

const CamScreen = () => {
  const { robotUrl } = useSettings();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!robotUrl) return;

    const socket = io(robotUrl);

    socket.on("camera_frame", (data: { image: string }) => {
      setImageSrc(`data:image/jpeg;base64,${data.image}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [robotUrl]);


  return (
    <div className={`bg-indigo-50 flex flex-col flex-grow items-center justify-center w-full
              border-t-8 border-y-10 border-indigo-700 relative overflow-hidden`}>
      <div className="flex flex-col items-center justify-center">
        {robotUrl ? (
          <img
            className="bg-indigo-200 rotate-180"
            width="640"
            height="480"
            alt="Live camera feed"
            src={imageSrc || ""}
          />
        ) : (
          <h1>Za funkcionalnost kamere morate povezat robota!</h1>
        )}
      </div>
    </div>
  );
};

export default CamScreen;
