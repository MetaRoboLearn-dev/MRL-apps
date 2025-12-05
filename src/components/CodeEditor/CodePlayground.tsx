import Editor, { OnMount } from "@monaco-editor/react";
import {useEffect, useRef} from "react";
import * as monaco from "monaco-editor";
import {useCode} from "../../hooks/useCode.ts";
import {useSettings} from "../../hooks/useSettings.ts";
import {codeTheme} from "./CodeTheme.ts";

const CodePlayground = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { codeRef, setCode } = useCode();
  const { selectedTab } = useSettings();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("default", codeTheme);
    monaco.editor.setTheme('default')
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setCode(value ?? '');
    }, 500);
  };

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, []);

  return (
    <Editor
      onMount={handleEditorDidMount}
      height="100%"
      defaultLanguage="python"
      theme="dark"
      value={codeRef.current ?? ''}
      onChange={handleCodeChange}
      keepCurrentModel={false}
      path={`python/${selectedTab}`}
      options={{
        fontSize: 20,
        lineNumbers: "on",
        minimap: { enabled: false },
        padding: { top: 10 },
      }}
    />
  );
};

export default CodePlayground;