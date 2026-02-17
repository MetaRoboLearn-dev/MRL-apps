import CamTab from "../Camera/CamTab.tsx";
import SimTab from "./SimTab.tsx";
import SimOptionsTab from "./SimOptionsTab.tsx";
import {useTaskConfig} from "../../../hooks/useTaskConfig.ts";

const SimHeader = () => {
  const {isEdit} = useTaskConfig()

  return (
    <ul className={'header flex-between font-display'}>
      <div className={'flex'}>
        <CamTab />
        {isEdit && <SimOptionsTab />}
      </div>
      <SimTab />
    </ul>
  );
};

export default SimHeader;
