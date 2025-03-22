import SimTab from "./SimTab.tsx";


const SimHeader = () => {
  return (
    // todo: pretvorit ovo u radio buttone? umjesto tab komponente
    <div className={"bg-white px-4 w-full h-14 z-10 flex items-end"}>
      <SimTab active={false} />
      <SimTab active={true} />
      <SimTab active={false} />
    </div>
  );
};

export default SimHeader;