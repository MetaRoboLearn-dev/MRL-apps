import SimScreen from "../components/Simulator/SimScreen.tsx";
import CodeScreen from "../components/CodeEditor/CodeScreen.tsx";
import Navbar from "../components/UI/Navbar.tsx";
import Footer from "../components/UI/Footer.tsx";

const MainPage = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full flex min-h-0">
        <CodeScreen/>
        <SimScreen/>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
