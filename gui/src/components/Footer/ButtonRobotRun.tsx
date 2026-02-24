import { FaRobot } from "react-icons/fa";
import { useCode } from "../../hooks/useCode.ts";
import { useMutation } from "@tanstack/react-query";
import {sendCommandToRobot} from "../../api/robotApi.ts";

const ButtonRobotRun = ({ disabled, robot }: { disabled: boolean; robot: string | null }) => {

  const { getCurrentCode } = useCode();

  const mutation = useMutation({
    mutationFn: (code: string) => {
      if (!robot) throw new Error("No robot selected");
      return sendCommandToRobot(robot, code);
    },
    onError: (e) => console.error("Failed to send command:", e),
  });

  return (
    <button
      disabled={disabled || mutation.isPending || !robot}
      className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-2 
        ${disabled || mutation.isPending ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
      onClick={() => {
        if (!robot) return;
        mutation.mutate(getCurrentCode())
      }}
    >
      <FaRobot size={24} />
      <span className="ml-4">{mutation.isPending ? "Šaljem..." : "Upogoni"}</span>
    </button>
  );
};

export default ButtonRobotRun;