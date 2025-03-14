import SimPlayground from "./SimPlayground.tsx";

const SimScreen = () => {
  return (
    <div className={`bg-turquoise-50 w-2/5 flex flex-col items-center justify-center box-border`}>
      <SimPlayground />
    </div>
  );
};

export default SimScreen;
