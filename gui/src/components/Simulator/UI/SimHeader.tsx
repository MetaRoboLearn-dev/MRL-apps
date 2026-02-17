import CamTab from "../Camera/CamTab.tsx";
import SimTab from "./SimTab.tsx";

const SimHeader = () => {
  return (
    <div className={'header flex-between font-display'}>
      <CamTab />
      <SimTab />

      {/*<SimCreate />*/}
    </div>
  );
};

export default SimHeader;
