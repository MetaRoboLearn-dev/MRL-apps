//workflow : Client Registration/Login → Fetch All Robots → Display in Dropdown → Send Code Command To Selected Robot

const API_BASE_URL = import.meta.env.VITE_BROKER_API_URL; // Change to your broker API URL
const REGISTER_KEY = import.meta.env.VITE_REGISTER_KEY; // Load register key from environment variable
const API_KEY = import.meta.env.VITE_API_KEY; // Load API key from environment variable

/*
POST /client/register
Headers: register_key: <your_register_key>
Body: {
  "Name": "my-webapp",
  "ApiKey": "<api_key>"
}
Response: { "ClientId": "<client_id>" }
*/
// Ivan : use .env file to store the register key and api key, and load them in the code
// Register client - only once
export const registerClient = async (name: string, apiKey: string) => {
    if (!REGISTER_KEY || !API_KEY) {
        throw new Error("Register key and API key must be set in environment variables");
    }   
    const response = await fetch(`${API_BASE_URL}/client/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'register-key': REGISTER_KEY
        },
        body: JSON.stringify({
            Name: name,
            ApiKey: apiKey
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to register client: ${response.statusText}`);
    }
    const data = await response.json();
    return data.ClientId;
};

/* 
POST /client/login
Headers: 
  client_name: "my-webapp"
  api_key: "<api_key>"
Response: {
  "ClientId": "<client_id>",
  "Token": "<auth_token>"
}
*/

// Ivan: login client - every session
export const loginClient = async (clientName: string, apiKey: string) => {
    if (!API_KEY) {
        throw new Error("API key must be set in environment variables");
    }
    const response = await fetch(`${API_BASE_URL}/client/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'client-name': clientName,
            'api-key': apiKey
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to login client: ${response.statusText}`);
    }
    const data = await response.json();
    return {
        ClientId: data.ClientId,
        Token: data.Token
    };
};

/*
GET /client/robot/info
Headers:
  client_id: "<client_id>"
  token: "<token_from_login>"
Response: [
  {
    "RobotId": "robot-123",
    "Name": "Robot A",
    "IsActivated": true,
    "ActivatedOnSSID": "WiFi-Network"
  },
  {
    "RobotId": "robot-456",
    "Name": "Robot B",
    "IsActivated": false,
    "ActivatedOnSSID": null
  }
]
*/
// Ivan: fetch all robots for the logged in client
export const fetchClientRobots = async (clientId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/client/robot/info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client-id': clientId,
            'token': token
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch client robots: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Return the array of robots
};

/*
POST /robot/{robot_id}/command
Headers:
  client_id: "<client_id>"
  token: "<token_from_login>"
Body: {
  "CommandType": "CODE",
  "CodeText": "print('Hello from webapp')"
}
Response: { "status": "command sent to queue" }
*/

export const sendCommandToRobot = async (clientId: string, token: string, robotId: string, codeText: string) => {
    const response = await fetch(`${API_BASE_URL}/robot/${robotId}/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'client-id': clientId,
            'token': token
        },
        body: JSON.stringify({
            CommandType: "CODE",
            CodeText: codeText
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to send command to robot: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Return the response from the broker
};

/*
WebSocket: ws://<server>/client/robot-log/<robot_id>?client_id=<id>&token=<token>
Note: browsers cannot set custom headers on WebSocket connections,
so credentials are passed as query params instead of headers.
*/

/** Closes a WebSocket only if it is not already closing/closed. */
export const safeCloseWs = (ws: WebSocket | null) => {
    if (ws && ws.readyState !== WebSocket.CLOSING && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
    }
};

export const connectRobotLogSocket = (
    robotId: string,
    clientId: string,
    token: string,
    onMessage: (log: { LogLevel: string; Message: string; RobotId?: string; Timestamp?: string }) => void,
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void
): WebSocket => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const base = `${protocol}://${window.location.host}/broker`;
    const url = `${base}/client/robot-log/${robotId}?client_id=${encodeURIComponent(clientId)}&token=${encodeURIComponent(token)}`;

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


    