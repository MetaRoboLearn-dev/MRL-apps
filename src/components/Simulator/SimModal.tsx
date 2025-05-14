import {useUI} from "../../hooks/useUI.ts";

const SimModal = () => {
  const { modalVisible, modalHeader, modalBody, modalFooter } = useUI();

  return (
    <div
      className={`
    absolute w-full h-full bg-black/25 flex items-center justify-center
    transition-opacity duration-300 ease-in-out
    ${modalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `}
    >
      <div
        className={`
      bg-sunglow-500 mx-auto min-w-80 max-w-120 p-6 rounded-md shadow-2xl text-dark-neutrals-500
      transform transition-all duration-300 ease-in-out
      ${modalVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
    `}
      >
        <p className="text-3xl font-semibold px-1 pt-1 pb-3 border-b-2 border-sunglow-800">
          {modalHeader}
        </p>
        <p className="text-xl pt-3 pl-2 pr-5">{modalBody}</p>
        <p className="text-lg pt-6 text-right">{modalFooter}</p>
      </div>
    </div>
  );
};

export default SimModal;
