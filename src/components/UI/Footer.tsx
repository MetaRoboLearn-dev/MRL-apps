import {FaPlay, FaRobot} from "react-icons/fa";

const Footer = () => {
  const runCode = async () => {
    const code = `for x in range(6):
  print(x)`;
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
        alert(data['output']);
      }
    } catch (e) {
      if(e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  return (
    <div className={'bg-white-smoke-500 px-15 w-full h-20 z-10 flex items-center justify-end'}>
      <div
        className={`bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                    hover:cursor-pointer hover:bg-sunglow-600 transition`}>
        <FaRobot size={24}/>
        <span className={'ml-4'}>Upogoni</span>
      </div>
      <div
        className={`bg-turquoise-500 text-light-cyan-200 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center ml-8 
                    hover:cursor-pointer hover:bg-turquoise-600 transition`}
        onClick={runCode}>
        <FaPlay size={18}/>
        <span className={'ml-4'}>Simuliraj</span>
      </div>
    </div>
  );
};

export default Footer;