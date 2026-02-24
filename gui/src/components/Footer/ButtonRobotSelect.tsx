import { useState, useEffect } from "react";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { fetchRobots } from "../../api/brokerApi.ts";

interface Robot {
  RobotId: string;
  Name: string;
  IsActivated: boolean;
  ActivatedOnSSID: string | null;
}

const robotsQueryOptions = queryOptions<Robot[]>({
  queryKey: ["robots"],
  queryFn: fetchRobots,
  staleTime: 30000,
  refetchOnWindowFocus: false,
});

interface Props {
  disabled: boolean;
  selectedRobotId: string | null;
  onSelectRobot: (robotId: string) => void;
}

const ButtonRobotSelect = ({ disabled, selectedRobotId, onSelectRobot }: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
  }, []);

  const { data: robots = [], isLoading } = useQuery({
    ...robotsQueryOptions,
    enabled: ready,
  });

  const activeRobots = robots.filter((r) => r.IsActivated);

  return (
    <select
      disabled={disabled || isLoading || !ready}
      value={selectedRobotId || ""}
      onChange={(e) => onSelectRobot(e.target.value)}
      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {!ready || isLoading ? (
        <option value="">Učitavanje…</option>
      ) : activeRobots.length === 0 ? (
        <option value="">Nema aktivnih robota..</option>
      ) : (
        <>
          <option value="" disabled>Odaberi robota</option>
          {activeRobots.map((robot) => (
            <option key={robot.RobotId} value={robot.RobotId}>
              {robot.Name} ({robot.RobotId.slice(0, 8)}…)
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default ButtonRobotSelect;