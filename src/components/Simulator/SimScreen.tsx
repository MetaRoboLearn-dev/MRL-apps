import SimPlayground from "./SimPlayground.tsx";
import SimHeader from "./SimHeader.tsx";
// import SimFooter from "./SimFooter.tsx";

const SimScreen = () => {
  return (
    <div className={`w-2/5 flex flex-col items-center justify-center box-border`}>
      <SimHeader />
      <SimPlayground />
      {/*<SimFooter />*/}
    </div>
  );
};

export default SimScreen;
