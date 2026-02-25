export const testBrokerConnection = async () => {
  const response = await fetch('/api/broker/test', {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Broker connection failed');
  }

  return response.json();
};

export const fetchRobots = async () => {
  const response = await fetch('/api/broker/robots', {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch robots');
  }

  return response.json();
};

export const sendCommand = async (robotId: string, code: string) => {
  const response = await fetch(`/api/broker/robots/${robotId}/command`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send command');
  }

  return response.json();
};

export const safeCloseWs = (ws: WebSocket | null) => {
  if (ws && ws.readyState !== WebSocket.CLOSING && ws.readyState !== WebSocket.CLOSED) {
    ws.close();
  }
};

export const connectRobotLogSocket = (
  robotId: string,
  onMessage: (log: { LogLevel: string; Message: string; RobotId?: string; Timestamp?: string }) => void,
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void,
): WebSocket => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.host}/api/broker/robots/${robotId}/logs`;

  onStatusChange('connecting');
  const ws = new WebSocket(url);

  ws.onopen = () => onStatusChange('connected');
  ws.onclose = () => onStatusChange('disconnected');
  ws.onerror = () => onStatusChange('error');
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      onMessage({ LogLevel: 'RAW', Message: event.data });
    }
  };

  return ws;
};