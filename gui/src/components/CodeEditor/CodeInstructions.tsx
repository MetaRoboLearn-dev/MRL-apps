import {useTaskConfig} from "../../hooks/useTaskConfig.ts";
import {RichTextEditor} from "../UI/RichTextEditor.tsx";

const CodeInstructions = () => {
  const {instructions} = useTaskConfig()
  return (
    <>
      <h1 className={'mb-5 w-full text-center font-display font-bold text-2xl tracking-wide text-dark-neutrals-400'}>Upute za rješavanje!</h1>
        {instructions == '' ? (
          <div className={'w-full text-center text-dark-neutrals-400'}>Nema uputa!</div>
        ) : (
          <div className={'bg-white mx-3 rounded-md text-dark-neutrals-400'}>
            <RichTextEditor value={instructions} readOnly className={'h-full'} />
          </div>
        )}
    </>
  );
};

export default CodeInstructions;
