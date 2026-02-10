import {Action, log_action} from "../../api/logApi.ts";
import {useCode} from "../../hooks/useCode.ts";
import {useSettings} from "../../hooks/useSettings.ts";

const SimPopUp = () => {
  const { modeRef, getCurrentValue } = useCode();
  const { groupName, awaitingReview, setAwaitingReview } = useSettings();

  const onYes = () => {
    log_action(groupName, modeRef.current, Action.ROBOT_END_SUCC, getCurrentValue())
    setAwaitingReview(false);
  }

  const onNo = () => {
    log_action(groupName, modeRef.current, Action.ROBOT_END_FAIL, getCurrentValue())
    setAwaitingReview(false);
  }

  return (
    <div className="font-display absolute bottom-2.5 w-full h-15 bg-cyan-700 text-light-cyan-200 p-2 px-5 flex items-center justify-between">
      <span className={"text-lg"}>Je li robot uspješno dosegnuo cilj?</span>

      <div className="flex gap-2">
        <button
          disabled={!awaitingReview}
          onClick={onYes}
          className="bg-emerald-500 text-white-smoke-200 font-display font-bold text-lg px-5 py-2 rounded flex items-center ml-2
          hover:cursor-pointer hover:bg-emerald-600 transition"
        >
          Da
        </button>

        <button
          disabled={!awaitingReview}
          onClick={onNo}
          className="bg-tomato-500 text-white-smoke-200 font-display font-bold text-lg px-5 py-2 rounded flex items-center ml-2
          hover:cursor-pointer hover:bg-tomato-600 transition"
        >
          Ne
        </button>
      </div>
    </div>
  );
};

export default SimPopUp;