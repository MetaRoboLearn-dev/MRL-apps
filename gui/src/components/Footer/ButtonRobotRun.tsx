import { FaRobot } from "react-icons/fa";
import { useCode } from "../../hooks/useCode.ts";
import { useMutation } from "@tanstack/react-query";
import { sendCommand } from "../../api/brokerApi.ts";
import {useTaskConfig} from "../../hooks/useTaskConfig.ts";
import {useConsole} from "../../hooks/useConsole.ts";

const ButtonRobotRun = ({ disabled, robot }: { disabled: boolean; robot: string | null }) => {
  const { addLog } = useConsole();
  const { getCurrentCode } = useCode();
  const { ustId } = useTaskConfig();

  const mutation = useMutation({
    mutationFn: (code: string) => {
      if (!robot) throw new Error("No robot selected");
      return sendCommand(robot, code, ustId);
    },
    onError: (e) => console.error("Failed to send command:", e),
  });

  return (
    <button
      disabled={disabled || mutation.isPending}
      className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
        ${disabled || mutation.isPending ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
      onClick={() => {
        if (!robot) {
          addLog("ERROR","Run - No robot selected");
          return;
        }
        mutation.mutate(getCurrentCode())
      }}
    >
      <FaRobot size={24} />
      <span className="ml-4">{mutation.isPending ? "Šaljem..." : "Upogoni"}</span>
    </button>
  );
};

export default ButtonRobotRun;