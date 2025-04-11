export const RunCode = async (code: string) => {
  const url = "http://127.0.0.1:8000/run-python";
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
      console.log(data);
      alert(data['output'] + '\n' + data['error'] + '\n');
    }
  } catch (e) {
    if(e instanceof Error) {
      console.error(e.message);
    }
  }
}