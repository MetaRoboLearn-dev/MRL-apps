import CodePlayground from "./CodePlayground.tsx";
import CodeHeader from "./CodeHeader.tsx";
// import CodeFooter from "./CodeFooter.tsx";

const CodeScreen = () => {
  return (
    <div className={'w-3/5 flex flex-col items-center justify-center box-border bg-sunglow-400'}>
      <CodeHeader />
      <CodePlayground />
      {/*<CodeFooter />*/}
    </div>
  );
};

export default CodeScreen;