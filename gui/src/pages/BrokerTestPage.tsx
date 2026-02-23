import { useState, useEffect, useRef } from "react";
import { registerClient, loginClient, fetchClientRobots, sendCommandToRobot, connectRobotLogSocket, safeCloseWs } from "../api/brokerApi.ts";

interface Robot {
  RobotId: string;
  Name: string;
  IsActivated: boolean;
  ActivatedOnSSID: string | null;
}

type StepStatus = "idle" | "loading" | "ok" | "error" | "skipped";

const CLIENT_NAME = "my-webapp-novi";
const STORAGE_KEY_CLIENT_ID = "broker_client_id";
const SESSION_KEY_TOKEN = "broker_token";
const SESSION_KEY_CLIENT_ID = "broker_session_client_id";

const Section = ({ title, status, children }: { title: string; status: StepStatus; children: React.ReactNode }) => {
  const badge: Record<StepStatus, string> = {
    idle: "bg-gray-200 text-gray-500",
    loading: "bg-yellow-100 text-yellow-700 animate-pulse",
    ok: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    skipped: "bg-blue-50 text-blue-400",
  };
  const label: Record<StepStatus, string> = { idle: "pending", loading: "loading…", ok: "ok", error: "error", skipped: "skipped (cached)" };
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
  const [regStatus, setRegStatus] = useState<StepStatus>("idle");
  const [regResult, setRegResult] = useState("");

  const [loginStatus, setLoginStatus] = useState<StepStatus>("idle");
  const [loginResult, setLoginResult] = useState("");
  const [clientId, setClientId] = useState("");
  const [token, setToken] = useState("");

  const [robotsStatus, setRobotsStatus] = useState<StepStatus>("idle");
  const [robotsResult, setRobotsResult] = useState("");
  const [robots, setRobots] = useState<Robot[]>([]);

  const [selectedRobotId, setSelectedRobotId] = useState("");
  const [codeText, setCodeText] = useState("print('Hello from webapp')");
  const [cmdStatus, setCmdStatus] = useState<StepStatus>("idle");
  const [cmdResult, setCmdResult] = useState("");

  // Logs
  const [logEntries, setLogEntries] = useState<{ level: string; message: string; timestamp?: string }[]>([]);
  const [wsStatus, setWsStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
  const wsRef = useRef<WebSocket | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Guard against React StrictMode double-invoking the effect
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const init = async () => {
      // 1. Register — skip if ClientId already stored
      let registeredClientId = localStorage.getItem(STORAGE_KEY_CLIENT_ID);
      if (registeredClientId) {
        setRegResult(`ClientId: ${registeredClientId} (from localStorage)`);
        setRegStatus("skipped");
      } else {
        setRegStatus("loading");
        try {
          registeredClientId = await registerClient(CLIENT_NAME, import.meta.env.VITE_API_KEY);
          localStorage.setItem(STORAGE_KEY_CLIENT_ID, registeredClientId);
          setRegResult(`ClientId: ${registeredClientId}`);
          setRegStatus("ok");
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          setRegResult(`Error: ${msg}`);
          setRegStatus("error");
          return;
        }
      }

      // 2. Login — skip if token already cached in sessionStorage for this tab
      let sessionClientId: string;
      let sessionToken: string;
      const cachedToken = sessionStorage.getItem(SESSION_KEY_TOKEN);
      const cachedClientId = sessionStorage.getItem(SESSION_KEY_CLIENT_ID);
      if (cachedToken && cachedClientId) {
        sessionClientId = cachedClientId;
        sessionToken = cachedToken;
        setClientId(sessionClientId);
        setToken(sessionToken);
        setLoginResult(`ClientId: ${sessionClientId}\nToken: ${sessionToken} (from sessionStorage)`);
        setLoginStatus("skipped");
      } else {
        setLoginStatus("loading");
        try {
          const res = await loginClient(CLIENT_NAME, import.meta.env.VITE_API_KEY);
          sessionClientId = res.ClientId;
          sessionToken = res.Token;
          sessionStorage.setItem(SESSION_KEY_TOKEN, sessionToken);
          sessionStorage.setItem(SESSION_KEY_CLIENT_ID, sessionClientId);
          setClientId(sessionClientId);
          setToken(sessionToken);
          setLoginResult(JSON.stringify(res, null, 2));
          setLoginStatus("ok");
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          setLoginResult(`Error: ${msg}`);
          setLoginStatus("error");
          return;
        }
      }

      // 3. Fetch robots
      setRobotsStatus("loading");
      let firstRobotId: string | null = null;
      try {
        const res: Robot[] = await fetchClientRobots(sessionClientId, sessionToken);
        setRobots(res);
        setRobotsResult(JSON.stringify(res, null, 2));
        if (res.length > 0) {
          firstRobotId = res[0].RobotId;
          setSelectedRobotId(firstRobotId);
        }
        setRobotsStatus("ok");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setRobotsResult(`Error: ${msg}`);
        setRobotsStatus("error");
        return;
      }
      // WebSocket auto-connects via the selectedRobotId useEffect below
    };

    init();
  }, []);

  const handleSendCommand = async () => {
    setCmdStatus("loading");
    try {
      const res = await sendCommandToRobot(clientId, token, selectedRobotId, codeText);
      setCmdResult(JSON.stringify(res, null, 2));
      setCmdStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setCmdResult(`Error: ${msg}`);
      setCmdStatus("error");
    }
  };

  // Reconnect when robot selection changes (after initial session is ready)
  useEffect(() => {
    if (!selectedRobotId || !clientId || !token) return;
    safeCloseWs(wsRef.current);
    wsRef.current = null;
    setLogEntries([]);
    const ws = connectRobotLogSocket(
      selectedRobotId,
      clientId,
      token,
      (log) => {
        setLogEntries(prev => [...prev, { level: log.LogLevel, message: log.Message, timestamp: log.Timestamp }]);
        setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      },
      (status) => setWsStatus(status)
    );
    wsRef.current = ws;
    return () => { safeCloseWs(ws); wsRef.current = null; };
  }, [selectedRobotId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefreshRobots = async () => {
    if (!clientId || !token) return;
    setRobotsStatus("loading");
    try {
      const res: Robot[] = await fetchClientRobots(clientId, token);
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

  const handleClearRegistration = () => {
    localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
    setRegResult("");
    setRegStatus("idle");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Broker API Test</h1>

      {/* Step 1 — Register (auto, cached) */}
      <Section title="1. Register Client" status={regStatus}>
        <p className="text-xs text-gray-400">
          Runs once and stores <code>ClientId</code> in localStorage. Skipped on subsequent loads.
        </p>
        <ResultBox result={regResult} />
        {regStatus === "skipped" && (
          <button onClick={handleClearRegistration} className="text-xs text-red-400 hover:underline">
            Clear cached registration
          </button>
        )}
      </Section>

      {/* Step 2 — Login (auto) */}
      <Section title="2. Login Client" status={loginStatus}>
        <p className="text-xs text-gray-400">Runs automatically each session using <code>VITE_API_KEY</code>.</p>
        <ResultBox result={loginResult} />
        {clientId && (
          <div className="text-xs text-gray-500 space-y-0.5">
            <div><span className="font-medium">ClientId:</span> {clientId}</div>
            <div><span className="font-medium">Token:</span> {token.slice(0, 20)}…</div>
          </div>
        )}
      </Section>

      {/* Step 3 — Fetch Robots (auto) */}
      <Section title="3. Fetch Robots" status={robotsStatus}>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">Runs automatically after login.</p>
          <button
            onClick={handleRefreshRobots}
            disabled={!clientId || !token || robotsStatus === "loading"}
            className="ml-auto text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
        <ResultBox result={robotsResult} />
      </Section>

      {/* Step 4 — Send Command (manual) */}
      <Section title="4. Send Code Command" status={cmdStatus}>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Select Robot</label>
          <select
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedRobotId}
            onChange={e => setSelectedRobotId(e.target.value)}
          >
            {robots.length === 0 && <option value="">— waiting for robots —</option>}
            {robots.filter(r => r.IsActivated).map(robot => (
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
            onChange={e => setCodeText(e.target.value)}
          />
        </div>
        <Btn onClick={handleSendCommand} disabled={!selectedRobotId || !codeText || cmdStatus === "loading"}>
          {cmdStatus === "loading" ? "Sending…" : "Send Command"}
        </Btn>
        <ResultBox result={cmdResult} />
      </Section>
      {/* Step 5 — Live Logs */}
      <Section title="5. Robot Logs (WebSocket)" status={wsStatus === 'idle' ? 'idle' : wsStatus === 'connecting' ? 'loading' : wsStatus === 'connected' ? 'ok' : wsStatus === 'error' ? 'error' : 'idle'}>
        <p className="text-xs text-gray-400">Auto-connected to selected robot. Status: <span className="font-medium">{wsStatus}</span></p>
        <div className="flex gap-2">
          <button
            onClick={() => setLogEntries([])}
            className="px-4 py-1.5 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-xs">
          {logEntries.length === 0 && (
            <span className="text-gray-500">No logs yet…</span>
          )}
          {logEntries.map((entry, i) => (
            <div key={i} className={`leading-5 ${
              entry.level === 'ERROR' ? 'text-red-400' :
              entry.level === 'WARNING' ? 'text-yellow-300' :
              entry.level === 'INFO' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              <span className="text-gray-500 mr-2">
                {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ''}
              </span>
              <span className="mr-2 font-bold">[{entry.level}]</span>
              {entry.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </Section>
    </div>
  );
};

export default BrokerTestPage;
