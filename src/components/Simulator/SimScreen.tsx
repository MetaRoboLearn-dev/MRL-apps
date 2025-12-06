import SimPlayground from "./SimPlayground.tsx";
import SimHeader from "./UI/SimHeader.tsx";
import {useSettings} from "../../hooks/useSettings.ts";
import CamScreen from "./Camera/CamScreen.tsx";

const SimScreen = () => {
  const { camMode } = useSettings();

  return (
    <div className={`w-2/5 flex-center flex-col box-border z-20`}>
      <SimHeader />
      {camMode ? (
        <CamScreen />
      ) : (
        <SimPlayground />
      )}
    </div>
  );
};

export default SimScreen;
