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