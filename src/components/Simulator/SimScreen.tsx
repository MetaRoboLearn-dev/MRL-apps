import SimPlayground from "./SimPlayground.tsx";
import SimHeader from "./UI/SimHeader.tsx";
import {useSettings} from "../../hooks/useSettings.ts";
import CamScreen from "./Camera/CamScreen.tsx";
import SimPopUp from "./SimPopUp.tsx";

const SimScreen = () => {
  const { camMode, awaitingReview } = useSettings();

  return (
    <div className={`w-2/5 flex-center flex-col box-border z-20 relative`}>
      <SimHeader />
      {camMode ? (
        <CamScreen />
      ) : (
        <SimPlayground />
      )}
      {awaitingReview && <SimPopUp />}
    </div>
  );
};

export default SimScreen;
