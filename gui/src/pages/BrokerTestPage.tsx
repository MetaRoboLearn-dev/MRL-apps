import { useState, useEffect, useRef } from "react";
import {
  testBrokerConnection,
  fetchRobots,
  sendCommand,
  connectRobotLogSocket,
  connectRobotPrintSocket,
  connectRobotCameraSocket,
  safeCloseWs,
  sendAbort,
} from "../api/brokerApi.ts";

interface Robot {
  RobotId: string;
  Name: string;
  IsActivated: boolean;
  ActivatedOnSSID: string | null;
}

type StepStatus = "idle" | "loading" | "ok" | "error";

const Section = ({ title, status, children }: { title: string; status: StepStatus; children: React.ReactNode }) => {
  const badge: Record<StepStatus, string> = {
    idle: "bg-gray-200 text-gray-500",
    loading: "bg-yellow-100 text-yellow-700 animate-pulse",
    ok: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
  };
  const label: Record<StepStatus, string> = {
    idle: "pending",
    loading: "loading…",
    ok: "ok",
    error: "error",
  };
  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge[status]}`}>{label[status]}</span>
      </div>
      {children}
    </div>
  );
};

const ResultBox = ({ result }: { result: string }) =>
  result ? (
    <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto max-h-40 whitespace-pre-wrap break-all">{result}</pre>
  ) : null;

const Btn = ({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const BrokerTestPage = () => {
  const [connStatus, setConnStatus] = useState<StepStatus>("idle");
  const [connResult, setConnResult] = useState("");

  const [robotsStatus, setRobotsStatus] = useState<StepStatus>("idle");
  const [robotsResult, setRobotsResult] = useState("");
  const [robots, setRobots] = useState<Robot[]>([]);

  const [selectedRobotId, setSelectedRobotId] = useState("");
  const [codeText, setCodeText] = useState("print('Hello from webapp')");
  const [cmdStatus, setCmdStatus] = useState<StepStatus>("idle");
  const [cmdResult, setCmdResult] = useState("");

  const [abortStatus, setAbortStatus] = useState<StepStatus>("idle");
  const [_abortResult, setAbortResult] = useState("");

  const [logEntries, setLogEntries] = useState<{ level: string; message: string; timestamp?: string }[]>([]);
  const [wsStatus, setWsStatus] = useState<"idle" | "connecting" | "connected" | "disconnected" | "error">("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [printEntries, setPrintEntries] = useState<{ text: string; timestamp?: string }[]>([]);
  const [printWsStatus, setPrintWsStatus] = useState<"idle" | "connecting" | "connected" | "disconnected" | "error">("idle");
  const printWsRef = useRef<WebSocket | null>(null);
  const printEndRef = useRef<HTMLDivElement>(null);

  const [cameraFrameUrl, setCameraFrameUrl] = useState<string | null>(null);
  const [cameraWsStatus, setCameraWsStatus] = useState<"idle" | "connecting" | "connected" | "disconnected" | "error">("idle");
  const cameraWsRef = useRef<WebSocket | null>(null);
  const prevFrameUrlRef = useRef<string | null>(null);

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const init = async () => {
      // 1. Test connection
      setConnStatus("loading");
      try {
        const res = await testBrokerConnection();
        setConnResult(JSON.stringify(res, null, 2));
        setConnStatus("ok");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setConnResult(`Error: ${msg}`);
        setConnStatus("error");
        return;
      }

      // 2. Fetch robots
      setRobotsStatus("loading");
      try {
        const res: Robot[] = await fetchRobots();
        setRobots(res);
        setRobotsResult(JSON.stringify(res, null, 2));
        if (res.length > 0) {
          setSelectedRobotId(res.filter(res => res.IsActivated)[0].RobotId);
        }
        setRobotsStatus("ok");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setRobotsResult(`Error: ${msg}`);
        setRobotsStatus("error");
      }
    };

    init();
  }, []);

  const handleSendCommand = async () => {
    setCmdStatus("loading");
    try {
      const res = await sendCommand(selectedRobotId, codeText);
      setCmdResult(JSON.stringify(res, null, 2));
      setCmdStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setCmdResult(`Error: ${msg}`);
      setCmdStatus("error");
    }
  };

  const handleAbortCommand = async () => {
        setAbortStatus("loading");
    try {
      const res = await sendAbort(selectedRobotId);
      setAbortResult(JSON.stringify(res, null, 2));
      setAbortStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAbortResult(`Error: ${msg}`);
      setAbortStatus("error");
    }
  };


  useEffect(() => {
    if (!selectedRobotId) return;

    safeCloseWs(wsRef.current);
    wsRef.current = null;
    setLogEntries([]);

    const ws = connectRobotLogSocket(
      selectedRobotId,
      (log) => {
        setLogEntries((prev) => [...prev, { level: log.LogLevel, message: log.Message, timestamp: log.Timestamp }]);
        setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      },
      (status) => setWsStatus(status),
    );
    wsRef.current = ws;

    return () => {
      safeCloseWs(ws);
      wsRef.current = null;
    };
  }, [selectedRobotId]);

  useEffect(() => {
    if (!selectedRobotId) return;

    safeCloseWs(printWsRef.current);
    printWsRef.current = null;
    setPrintEntries([]);

    const ws = connectRobotPrintSocket(
      selectedRobotId,
      (msg) => {
        setPrintEntries((prev) => [...prev, { text: msg.Text, timestamp: msg.Timestamp }]);
        setTimeout(() => printEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      },
      (status) => setPrintWsStatus(status),
    );
    printWsRef.current = ws;

    return () => {
      safeCloseWs(ws);
      printWsRef.current = null;
    };
  }, [selectedRobotId]);

  useEffect(() => {
    if (!selectedRobotId) return;

    safeCloseWs(cameraWsRef.current);
    cameraWsRef.current = null;
    if (prevFrameUrlRef.current) {
      URL.revokeObjectURL(prevFrameUrlRef.current);
      prevFrameUrlRef.current = null;
    }
    setCameraFrameUrl(null);
    
    const ws = connectRobotCameraSocket(
      selectedRobotId,
      (blob) => {
        const url = URL.createObjectURL(blob);
        setCameraFrameUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        prevFrameUrlRef.current = url;
      },
      (status) => setCameraWsStatus(status),
    );
    cameraWsRef.current = ws;

    return () => {
      safeCloseWs(ws);
      cameraWsRef.current = null;      
      if (prevFrameUrlRef.current) {
        URL.revokeObjectURL(prevFrameUrlRef.current);
        prevFrameUrlRef.current = null;
      }
    };
  }, [selectedRobotId]);

  const handleRefreshRobots = async () => {
    setRobotsStatus("loading");
    try {
      const res: Robot[] = await fetchRobots();
      setRobots(res);
      setRobotsResult(JSON.stringify(res, null, 2));
      if (res.length > 0 && !selectedRobotId) setSelectedRobotId(res[0].RobotId);
      setRobotsStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setRobotsResult(`Error: ${msg}`);
      setRobotsStatus("error");
    }
  };

  return (
    <div className="w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Broker API Test</h1>

      {/* Step 1 — Test Connection */}
      <Section title="1. Test Connection" status={connStatus}>
        <p className="text-xs text-gray-400">Tests that the backend can reach and authenticate with the broker.</p>
        <ResultBox result={connResult} />
      </Section>

      {/* Step 2 — Fetch Robots */}
      <Section title="2. Fetch Robots" status={robotsStatus}>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">Fetches available robots via the backend.</p>
          <button
            onClick={handleRefreshRobots}
            disabled={robotsStatus === "loading"}
            className="ml-auto text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
        <ResultBox result={robotsResult} />
      </Section>

      {/* Step 3 — Send Command */}
      <Section title="3. Send Code Command" status={cmdStatus}>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Select Robot</label>
          <select
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedRobotId}
            onChange={(e) => {
              console.log(e.target.value)
              setSelectedRobotId(e.target.value);
            }}
          >
            {robots.length === 0 && <option value="">— waiting for robots —</option>}
            {robots
              .filter((r) => r.IsActivated)
              .map((robot) => (
                <option key={robot.RobotId} value={robot.RobotId}>
                  {robot.Name} ({robot.RobotId})
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Code</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
          />
        </div>
        <Btn onClick={handleSendCommand} disabled={!selectedRobotId || !codeText || cmdStatus === "loading"}>
          {cmdStatus === "loading" ? "Sending…" : "Send Command"}
        </Btn>
        <button className="ml-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
           onClick={handleAbortCommand} disabled={!selectedRobotId || abortStatus === "loading"}>
          {abortStatus === "loading" ? "Aborting…" : "Abort Command"}
        </button>
        <ResultBox result={cmdResult} />
      </Section>

      {/* Step 4 — Live Logs */}
      <Section
        title="4. Robot Logs (WebSocket)"
        status={wsStatus === "idle" ? "idle" : wsStatus === "connecting" ? "loading" : wsStatus === "connected" ? "ok" : "error"}
      >
        <p className="text-xs text-gray-400">
          Auto-connected to selected robot. Status: <span className="font-medium">{wsStatus}</span>
        </p>
        <div className="flex gap-2">
          <button onClick={() => setLogEntries([])} className="px-4 py-1.5 text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs">
          {logEntries.length === 0 && <span className="text-gray-500">No logs yet…</span>}
          {logEntries.map((entry, i) => (
            <div
              key={i}
              className={`leading-5 ${
                entry.level === "ERROR"
                  ? "text-red-400"
                  : entry.level === "WARNING"
                    ? "text-yellow-300"
                    : entry.level === "INFO"
                      ? "text-green-400"
                      : "text-gray-300"
              }`}
            >
              <span className="text-gray-500 mr-2">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ""}
              </span>
              <span className="mr-2 font-bold">[{entry.level}]</span>
              {entry.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </Section>
      {/* Step 5 — Robot stdout (robot-print) */}
      <Section
        title="5. Robot stdout (WebSocket)"
        status={printWsStatus === "idle" ? "idle" : printWsStatus === "connecting" ? "loading" : printWsStatus === "connected" ? "ok" : "error"}
      >
        <p className="text-xs text-gray-400">
          Streams live <code>print()</code> output from the robot. Status:{" "}
          <span className="font-medium">{printWsStatus}</span>
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPrintEntries([])} className="px-4 py-1.5 text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs">
          {printEntries.length === 0 && <span className="text-gray-500">No output yet…</span>}
          {printEntries.map((entry, i) => (
            <div key={i} className="leading-5 text-green-300">
              <span className="text-gray-500 mr-2">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ""}
              </span>
              {entry.text}
            </div>
          ))}
          <div ref={printEndRef} />
        </div>
      </Section>
      {/* Step 6 — Robot stdout (robot-print) */}
      <Section
        title="6. Robot camra (WebSocket)"
        status={printWsStatus === "idle" ? "idle" : printWsStatus === "connecting" ? "loading" : printWsStatus === "connected" ? "ok" : "error"}
      >
        <p className="text-xs text-gray-400">
          Streams live <code>camera feed</code> from the robot. Status:{" "}
          <span className="font-medium">{printWsStatus}</span>
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPrintEntries([])} className="px-4 py-1.5 text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs">
          {printEntries.length === 0 && <span className="text-gray-500">No output yet…</span>}
          {printEntries.map((entry, i) => (
            <div key={i} className="leading-5 text-green-300">
              <span className="text-gray-500 mr-2">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ""}
              </span>
              {entry.text}
            </div>
          ))}
          <div ref={printEndRef} />
        </div>
      </Section>
      {/* Step 6 — Camera feed (WebSocket) */}
      <Section
        title="6. Camera Feed (WebSocket)"
        status={cameraWsStatus === "idle" ? "idle" : cameraWsStatus === "connecting" ? "loading" : cameraWsStatus === "connected" ? "ok" : "error"}
      >
        <p className="text-xs text-gray-400">
          Live JPEG frames from the robot camera. Status:{" "}
          <span className="font-medium">{cameraWsStatus}</span>
        </p>
        <div className="bg-gray-900 rounded flex items-center justify-center" style={{ minHeight: "240px" }}>
          {cameraFrameUrl ? (
            <img src={cameraFrameUrl} alt="Robot camera" className="max-w-full max-h-60 rounded" />
          ) : (
            <span className="text-gray-500 text-xs font-mono">
              {selectedRobotId ? "Waiting for frames…" : "No robot selected."}
            </span>
          )}
        </div>
      </Section>
    </div>
  );
};

export default BrokerTestPage;