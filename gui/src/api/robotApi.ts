// const apiUrl = import.meta.env.VITE_API_URL;

export const run_code = async (code: string) => {
  const url = "api/run-python";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.ok) {
      return await response.json();
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

export const abort_robot = async (robotUrl: string | null) => {
  const url = robotUrl + "/abort";
  try {
    const response = await fetch(url, {
      method: "POST",
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
      console.error(e.message);
    }
  }
}