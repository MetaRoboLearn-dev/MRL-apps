import Editor, { OnMount } from "@monaco-editor/react";
import {useEffect, useRef} from "react";
import * as monaco from "monaco-editor";
import {useCode} from "../../hooks/useCode.ts";
import {useSettings} from "../../hooks/useSettings.ts";

const colours = {
  'background': '#fffbde',
  'foreground': '#676767',  // --color-white-smoke-900
  'lineHighlightBackground': '#ffeb9e', // --color-sunglow-200
  'lineNumber.foreground': '#454949', // --color-dark-neutrals-400
  'lineNumber.activeForeground': '#101414', // --color-dark-neutrals-700

  'keyword': '#b43a30', // --color-tomato-700
  'comment': '#b49220', // --color-sunglow-700
  'string': '#008e91', // --color-turquoise-700
}

const CodePlayground = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { codeRef, setCode } = useCode();
  const { selectedTab } = useSettings();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("default", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: colours['keyword']},
        { token: "identifier", foreground: colours['foreground'] },
        { token: "number", foreground: colours['string'] },
        { token: "string", foreground: colours['string'] },
        { token: "comment", foreground: colours['comment']},
      ],
      colors: {
        "editor.background": colours['background'],
        "editor.foreground": colours['foreground'],
        "editorLineNumber.foreground": colours['lineNumber.foreground'],
        "editorLineNumber.activeForeground": colours['lineNumber.activeForeground'],
        "editorCursor.foreground": colours['foreground'],
        "editor.lineHighlightBackground": colours['lineHighlightBackground'],
      },
    });

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

  return (
    <Editor
      onMount={handleEditorDidMount}
      height="100%"
      defaultLanguage="python"
      theme="dark"
      value={codeRef.current ?? ''}
      onChange={(value) => setCode(value ?? '')}
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
