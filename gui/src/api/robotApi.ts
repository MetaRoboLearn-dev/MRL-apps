export const run_code = async (code: string, currentValue: string, ustId: number | null = null) => {
  const url = "/api/sandbox/run-python";
  try {
    const response = await fetch(url, {
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({ code, user_started_task_id: ustId, code_snapshot: currentValue }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
}

export const run_robot = async (code: string, robotUrl: string | null) => {
  if (!robotUrl) return;
  const url = robotUrl + "/execute";
  try {
    const response = await fetch(url, {
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return response.json();
    }
    else {
      return {
        error: "Robot error",
        status: response.status,
        statusText: response.statusText
      }
    }
  } catch (e) {
    if(e instanceof Error) {
      return e;
    }
  }
}