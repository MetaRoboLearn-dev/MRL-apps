import { FaPlay, FaRobot  } from "react-icons/fa";

const SimFooter = () => {
  return (
    <div className={'bg-white px-15 w-full h-20 z-10 flex items-center justify-between'}>
      <div className={'bg-sunglow-500 text-dark-neutrals-400 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center'}>
        <FaRobot size={24} />
        <span className={'ml-4'}>Upogoni!</span>
      </div>
      <div
        className={'bg-turquoise-500 text-light-cyan-200 font-display font-bold text-xl pl-5 pr-8 py-2 rounded flex items-center'}>
        <FaPlay size={18}/>
        <span className={'ml-4'}>Simuliraj!</span>
      </div>
    </div>
  );
};

export default SimFooter;