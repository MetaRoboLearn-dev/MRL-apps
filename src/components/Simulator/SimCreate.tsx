import {useUI} from "../../hooks/useUI.ts";
import SimCreateForm from "./SimCreateForm.tsx";

const SimCreate = () => {
  const { setModalVisible, setModalHeader, setModalBody, setModalFooter } = useUI();

  const showModalWindow = () =>{
    setModalHeader('Stvaranje simulacije');
    setModalBody(<SimCreateForm />)
    setModalFooter(null)
    setModalVisible(true);
  }

  return (
    <div className={`text-dark-neutrals-400 font-bold text-3xl px-1 mx-3 mb-1 select-none transition
        hover:cursor-pointer hover:text-dark-neutrals-800 hover:scale-110`}
         onClick={showModalWindow}>+</div>
  );
};

export default SimCreate;