import {FaCheckSquare,} from "react-icons/fa";

const TaskSubmitButton = () => {
  const disabled = false
  return (
    <button className={`bg-turquoise-500 text-light-cyan-200 button-lg ml-8
                  ${disabled ? 'bg-turquoise-700 text-light-cyan-700' : 'hover:cursor-pointer hover:bg-turquoise-600'} transition`}>
      <FaCheckSquare size={22}/>
      <span className={'ml-4'}>Predaj i završi</span>
    </button>
  );
};

export default TaskSubmitButton;