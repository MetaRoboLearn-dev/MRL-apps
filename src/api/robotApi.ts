import {MoveCommand} from "../types.ts";

const apiUrl = import.meta.env.VITE_API_URL;

const processSteps = (steps: string[]): MoveCommand[] => {
  return steps
    .filter(step => step.trim() !== '')
    .map(step => {
      const command = step.trim().toLowerCase();
      if (command === 'naprijed') {
        return { type: 'move', direction: 'forward' }
      }
      else if (command === 'nazad') {
        return { type: 'move', direction: 'backward' }
      }
      else if (command === 'lijevo') {
        return { type: 'rotate', direction: 'left' }
      }
      else if (command === 'desno') {
        return { type: 'rotate', direction: 'right' }
      }
      return { type: 'invalid', command }
    })
}

export const run_code = async (code: string) => {
  const url = apiUrl + "/run-python";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      const data = await response.json();
      const steps = data.output.split('\n');
      return processSteps(steps);
    }
  } catch (e) {
    if(e instanceof Error) {
      console.error(e.message);
    }
  }
}

export const run_robot = async (code: string, robotUrl: string | null) => {
  if (!robotUrl) return;
  const url = robotUrl + "/execute";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      console.log('ok, ', code);
    }
  } catch (e) {
    if(e instanceof Error) {
      console.error(e.message);
    }
  }
}

export const abort_robot = async (robotUrl: string | null) => {
  const url = robotUrl + "/abort";
  try {
    const response = await fetch(url, {
      method: "POST",
    })
    if (!response.ok) {
      console.log('abort not ok');
    }
  } catch (e) {
    if(e instanceof Error) {
      console.error(e.message);
    }
  }
}