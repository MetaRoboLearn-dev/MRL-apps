import Simulation from "../components/Simulation.tsx";
import CodeEditor from "../components/CodeEditor.tsx";

const MainPage = () => {
  return (
    <div className={"w-full h-screen flex"}>
      <Simulation/>
      <CodeEditor/>
    </div>
  );
};

export default MainPage;
