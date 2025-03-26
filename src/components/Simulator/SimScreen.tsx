import SimPlayground from "./SimPlayground.tsx";
import SimHeader from "./SimHeader.tsx";

const SimScreen = () => {
  return (
    <div className={`w-2/5 flex flex-col items-center justify-center box-border z-20`}>
      <SimHeader />
      <SimPlayground />
    </div>
  );
};

export default SimScreen;
