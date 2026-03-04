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

export const sendCommand = async (robotId: string, code: string, ustId: number | null = null) => {
  const response = await fetch(`/api/broker/robots/${robotId}/command`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      user_started_task_id: ustId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send command');
  }

  return response.json();
};

export const sendAbort = async (robotId: string) => {
  const response = await fetch(`/api/broker/robots/${robotId}/abort`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send abort');
  }
  return response.json();
};

export const safeCloseWs = (ws: WebSocket | null) => {
  if (ws && ws.readyState !== WebSocket.CLOSING && ws.readyState !== WebSocket.CLOSED) {
    ws.close();
  }
};

export const connectRobotCameraSocket = (
  robotId: string,
  onFrame: (blob:Blob) => void,
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void,
): WebSocket => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.host}/api/broker/robots/${robotId}/camera`;

  onStatusChange('connecting');
  const ws = new WebSocket(url);
  ws.binaryType = 'blob';

  ws.onopen = () => onStatusChange('connected');
  ws.onclose = () => onStatusChange('disconnected');
  ws.onerror = () => onStatusChange('error');
  ws.onmessage = (event) => {
    try {
      if (event.data instanceof Blob) {
        onFrame(event.data);
      } else {
        const data = JSON.parse(event.data);
        console.error('Received non-blob message on camera socket:', data);
      }
    } catch (error) {
      console.error('Error processing camera socket message:', error);
    }
  };
  return ws;
};

export const connectRobotPrintSocket = (
  robotId: string,
  onMessage: (entry: { RobotId: string; Timestamp: string; Text: string }) => void,
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void,
): WebSocket => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.host}/api/broker/robots/${robotId}/stdout`;

  onStatusChange('connecting');
  const ws = new WebSocket(url);
  ws.onopen = () => onStatusChange('connected');
  ws.onclose = () => onStatusChange('disconnected');
  ws.onerror = () => onStatusChange('error');
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.RobotId !== undefined) {
        onMessage(data as { RobotId: string; Timestamp: string; Text: string });
      }
    } catch {

      onMessage({ RobotId: robotId, Timestamp: new Date().toISOString(), Text: event.data });
    }
  };

  return ws;
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