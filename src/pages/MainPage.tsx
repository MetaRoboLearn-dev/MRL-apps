import SimScreen from "../components/SimScreen.tsx";
import CodeScreen from "../components/CodeScreen.tsx";

const MainPage = () => {
  return (
    <div className={"w-full h-screen flex"}>
      <SimScreen/>
      <CodeScreen/>
    </div>
  );
};

export default MainPage;
